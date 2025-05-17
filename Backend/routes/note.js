import  express  from "express";
import * as noteController from "../controllers/noteControler.js"
import { tokenMiddleware } from "../backedLogic/tokenFunc.js";

const router = express.Router();

router
  .route('/')
  .put(tokenMiddleware, noteController.edit)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/:bookId')
  .get(tokenMiddleware, noteController.getNote)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });


export default router;