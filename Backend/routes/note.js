import  express  from "express";
import * as noteController from "../controllers/noteControler.js"

const router = express.Router();

router
  .route('/')
  .post(noteController.edit)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });


export default router;