import { PrismaClient } from "@prisma/client";
import axios from 'axios';

const prisma = new PrismaClient();

export const search = async (req, res) =>{
    const { title } = req.params;

  if (!title) {
    return res.status(400).json({ error: 'Missing "title" query parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `intitle:${title}`,
        printType: 'books',
        key: process.env.GOOGLE_API_KEY,
      },
    });

    const books = response.data.items || [];

    // const formattedBooks = books.map((item) => {
    //   return {
    //     title: item.volumeInfo.title,
    //     googleId: item.id,
    //     authors: item.volumeInfo.authors || null,
    //     thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
    //     rating: item.volumeInfo.averageRating || null,
    //     description: item.volumeInfo.description || null,
    //     ratingsCount: item.volumeInfo.ratingsCount || 0,
    //   };
    // });

    const formattedBooks = books
    .filter(item => {
        const lang = item.volumeInfo?.language;
        return lang === 'en' || lang === 'pl';
    })
    .map(item => ({
        title: item.volumeInfo.title,
        googleId: item.id,
        authors: item.volumeInfo.authors || null,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        rating: item.volumeInfo.averageRating || null,
        description: item.volumeInfo.description || null,
        ratingsCount: item.volumeInfo.ratingsCount || 0,
    }));

    formattedBooks.sort((a, b) => b.ratingsCount - a.ratingsCount);

    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    return res.status(500).json({ error: 'Failed to fetch books' });
  }

}

export const assigne = async (req, res) => {
    const { googleId } = req.body;
    const { userId } = req;
  
    if (!googleId) {
      return res.status(400).json({ error: 'Missing Google Book ID' });
    }
  
    if (!userId) {
      return res.status(401).json({ error: 'Missing user ID' });
    }
  
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleId}`, {
        params: {
          key: process.env.GOOGLE_BOOKS_API_KEY,
        },
        validateStatus: () => true, 
      });
  
      if (response.status === 200) {
        const book = await prisma.book.findFirst({
            where:{
                userId:userId,
                googleId:googleId
            }
        })

        if(book) return res.status(400).json({message:"Book already added"})

        const NewBook = await prisma.book.create({
          data: {
            userId,
            googleId,
          },
        });
  
        return res.status(201).json({NewBook});

      } else if (response.status === 404) {
        return res.status(404).json({message: 'Book not found in Google Books'});
      } else {
        return res.status(response.status).json({message: 'Error occurred while fetching book from Google'});
      }
  
    } catch (error) {
      console.error('Error during book assignment:', error.message);
      return res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
      });
    }
  };

export const deAssigne = async (req, res) =>{
    const { bookId } = req.params;
    const {userId} = req;

    const book = await prisma.book.createMany({
        where:{
            bookId:bookId,
            userId:userId
        }
    })

    if(!bookId) return res.status(404).json({message:"Book does not exist"})

    try{
    await prisma.book.deleteMany({
        where:{
            bookId:bookId,
            userId:userId
        }
    })
    return res.status(200).json({message: "Book deleted"})

    }catch{
        return res.status(500)
    }
}

export const userBooks = async (req, res) =>{
    const {userId} = req;

    const allBooks = await prisma.book.findMany({
        where:{
            userId:userId
        },
        include:{
            notes:true
        }
    })
    const bookDetailsPromises = allBooks.map(async (book) => {
        try {
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book.googleId}`, {
            params: {
              key: process.env.GOOGLE_API_KEY,
            },
          });
    
          const item = response.data;
          const lang = item.volumeInfo?.language;

    
          return {
            title: item.volumeInfo.title,
            googleId: item.id,
            authors: item.volumeInfo.authors || null,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
            rating: item.volumeInfo.averageRating || null,
            description: item.volumeInfo.description || null,
            ratingsCount: item.volumeInfo.ratingsCount || 0,
            bookId: book.id,
            notes: book.note?.body || null
          };
        } catch (error) {
          console.error(`Error fetching book with ID ${book.googleId}:`);
          return null;
        }
      });
    
      const bookDetails = await Promise.all(bookDetailsPromises);
      const formattedBooks = bookDetails.filter(Boolean);
    
      formattedBooks.sort((a, b) => b.ratingsCount - a.ratingsCount);
    
    return res.status(200).json(formattedBooks)
}

