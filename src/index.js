import express from "express";
import "dotenv/config";
import cors from "cors";

import { connectDb } from "./lib/db.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);

app.listen(PORT, () => {
  console.log(`Server is listening port : ${PORT}`);
  connectDb();
});
