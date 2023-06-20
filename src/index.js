import express from "express";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import globalErrorHandler from "./controllers/errorCtrls.js";
import notFoundHandler from "./middlewares/errorMiddleware.js";
import { dbConnect } from "./config/dbConnect.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//USING ROUTES
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

//DEFAULT ROUTE
app.all("*", notFoundHandler);

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

async function main() {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
