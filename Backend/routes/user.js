import  express  from "express";
import * as userController from "../controllers/userControler.js"

const router = express.Router();

router
  .route('/')
  .get(userController.me)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/register')
  .post(userController.register)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

router
  .route('/login')
  .post(userController.login)
  .all((req, res) => {
    return res.status(405).json({ message: 'Method Not Allowed' });
  });

export default router;