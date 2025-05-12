import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutesr from "./routes/user.js";
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json');

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/user', userRoutesr)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(`📘 Swagger docs available at: http://localhost:${PORT}/api-docs`);

app.listen(
    PORT, 
    () => console.log(`server running at port ${PORT}`)
);