import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import { isOwner } from "../backedLogic/isOwner.js";

const prisma = new PrismaClient();

export const search = async (req, res) =>{
    const { title } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Missing "title" query parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `intitle:${title}`,
        printType: 'books',
        maxResults:40,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    const books = response.data.items || [];

    const formattedBooks = books
    .filter(item => {
        const lang = item.volumeInfo?.language;
        return (lang === 'en' || lang === 'pl') //&& lang !== null;
    })
    .map(item => ({
        title: item.volumeInfo.title,
        googleId: item.id,
        authors: item.volumeInfo.authors || null,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        rating: item.volumeInfo.averageRating || null,
        description: item.volumeInfo.description || null,
        ratingsCount: item.volumeInfo.ratingsCount || 0,
        language:item.volumeInfo?.language,
    }));

    formattedBooks.sort((a, b) => b.ratingsCount - a.ratingsCount);

    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    return res.status(500).json({ message: 'Failed to fetch books' });
  }

}

export const assigne = async (req, res) => {
    const { googleId } = req.body;
    const { userId } = req;
  
    if (!googleId) {
      return res.status(400).json({ message: 'Missing Google Book ID' });
    }
  
    if (!userId) {
      return res.status(401).json({ message: 'Missing user ID' });
    }
  
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleId}`, {
        params: {
          key: process.env.GOOGLE_API_KEY,
        },
        validateStatus: () => true,
      });
    
      if (response.status === 200) {
        const book = await prisma.book.findFirst({
          where: {
            userId: userId,
            googleId: googleId
          }
        });
    
        if (book) return res.status(409).json({ message: "This book is already in your collection" });
    
        const newBook = await prisma.book.create({
          data: {
            userId,
            googleId,
          },
        });
    
        await prisma.note.create({
          data: {
            bookId: newBook.id,
            body: ""
          }
        });
    
        return res.status(201).json({ newBook });
    
      } else {
        return res.status(404).json({ message: 'Book not found in Google Books' });
      }
    
    } catch (err) {
      return res.status(500).json({ message: 'Book not found (network error)' });
    }
  };

export const deAssigne = async (req, res) =>{
    const { bookId } = req.params;
    const {userId} = req;

    if (!userId) {
      return res.status(401).json({ error: 'Missing authentication' });
    }

    const book = await prisma.book.findFirst({
        where:{
            id:bookId
        }
    })

    if(!book) return res.status(404).json({message:"Book not found"});

    
    const is = await isOwner(bookId, userId, res) ;
    if(!is) return res.status(403).json({message:"User is not owner"});

    try{
      await prisma.book.deleteMany({
          where:{
              id:bookId,
              userId:userId
          }
      })

    return res.status(200).json({message: "Book removed from collection"})

    }catch{
        return res.status(500).json({ message: "Failed to remove book" });
    }
}

export const userBooks = async (req, res) =>{
    const {userId} = req;

    if (!userId) {
      return res.status(401).json({ error: 'Missing authentication' });
    }

    const allBooks = await prisma.book.findMany({
        where:{
            userId:userId
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
    
          return {
            title: item.volumeInfo.title,
            googleId: item.id,
            authors: item.volumeInfo.authors || null,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
            rating: item.volumeInfo.averageRating || null,
            description: item.volumeInfo.description || null,
            ratingsCount: item.volumeInfo.ratingsCount || 0,
            bookId: book.id,
          };
        } catch (e) {
          console.error(`Error fetching book with ID ${book.googleId}:`);
        }
      });
    
      const bookDetails = await Promise.all(bookDetailsPromises);
      const formattedBooks = bookDetails.filter(Boolean);
    
      formattedBooks.sort((a, b) => b.ratingsCount - a.ratingsCount);
    
    return res.status(200).json(formattedBooks)
}

