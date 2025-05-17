import { PrismaClient } from "@prisma/client";
import {tokenGetter} from "../backedLogic/tokenFunc.js"

const prisma = new PrismaClient();

export const edit = async (req, res) =>{
    const { body, bookId } = req.body;
    const { userId } = req;

    if (!userId) {
        return res.status(401).json({ message: "Missing user ID" });
    }

    if (!body) {
        return res.status(400).json({ message: "Missing note content (body)" });
    }
    if (!bookId) {
        return res.status(400).json({ message: "Missing bookId" });
    }

    const note = await prisma.note.findMany({
        where:{
            bookId:bookId
        }
    })

    if (!note.length) {
        return res.status(404).json({ message: "Note not found" });
    }

    await prisma.note.updateMany({
        where:{
            bookId:bookId
        },
        data:{
            body:body
        }
    })

    return res.status(200).json({message:"note updated succesfully"})
}

export const getNote = async (req, res) =>{
    const { bookId } = req.params;

    if(!bookId){
        return res.status(400).json({ message: "Missing bookId parameter" });
    }

    const book = await prisma.book.findFirst({
        where:{
            id:bookId
        }
    })

    if(!book){
        return res.status(404).json({ message: "Book not found" });
    }

    const note = await prisma.note.findFirst({
        where:{
            bookId:bookId
        }
    })

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({note});
}