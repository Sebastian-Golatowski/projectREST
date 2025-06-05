import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {userInfo, tokenMaker} from "../backedLogic/tokenFunc.js"

const prisma = new PrismaClient();
const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const register = async (req, res) =>{
    const { username, password, secPassword} = req.body;

    if (!username || !password || !secPassword) {
      return res.status(400).json({ message: "Username, password and password confirmation are required" });
    }

    const user = await prisma.user.findFirst({
      where:{
        username:username
      }
    })

    if(user){
      return res.status(409).json({message:"Username is already taken"})
    }

    if(password != secPassword){
      return res.status(400).json({message:"Passwords do not match"})
    }

    if(!pattern.test(password)){
      return res.status(400).json({message:"Password does not meet the requirements"})
    }
    
    const newUser = await prisma.user.create({
      data:{
        username:username,
        password:bcrypt.hashSync(password, 10),
      }
    })

    const token = tokenMaker(newUser.id, newUser.username)

    return res.status(201).json({message:"User created successfully", token:token})
}

export const login = async (req, res) =>{
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findFirst({
      where:{
        username:username
      }
    })
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = tokenMaker(user.id, user.username)

    return res.status(200).json({ message: "Login successful", token:token });
}

export const me = async (req, res) =>{
  const {id, username} = await userInfo(req, res);
  if(id == null) return
  
  return res.status(200).json({id, username})
}

// const res = await fetch('/api/some-protected-endpoint', {
//   method: 'GET', // or POST, DELETE, etc.
//   headers: {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   }
// });