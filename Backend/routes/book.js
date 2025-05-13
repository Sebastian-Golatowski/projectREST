import  express  from "express";
import * as bookController from "../controllers/bookControler.js"
import { tokenMiddleware } from "../backedLogic/tokenFunc.js";

const router = express.Router();


router
  .route('/search/:title')
  .get(tokenMiddleware,bookController.search)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/', )
  .post(tokenMiddleware, bookController.assigne)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/dashboard')
  .get(tokenMiddleware,bookController.userBooks)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/:bookId')
  .delete(tokenMiddleware,bookController.deAssigne)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });


export default router;