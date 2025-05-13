import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutesr from "./routes/user.js";
import bookRouter from "./routes/book.js"
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;

app.use(bodyParser.json());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', userRoutesr);
app.use('/api/book', bookRouter);
// app.use('api/note', noteRouter);

console.log(`📘 Swagger docs available at: http://localhost:${PORT}/api-docs`);

app.listen(
    PORT, 
    () => console.log(`server running at port ${PORT}`)
);