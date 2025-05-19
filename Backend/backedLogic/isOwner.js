import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isOwner = async (bookId, userId, res) => {
    const ownerBook = await prisma.book.findFirst({
        where:{
            id:bookId,
            userId:userId
        }
    })

    if(!ownerBook) return res.status(403).json({message:"User is not owner"});

    return ownerBook;
}