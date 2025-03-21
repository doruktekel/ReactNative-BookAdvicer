import express from "express";

import {
  createBook,
  deleteBook,
  getAllBooks,
} from "../controllers/bookControllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, createBook);
router.get("/", protectRoute, getAllBooks);

router.get("/:userId", protectRoute, getAllBooks);
router.delete("/:id", protectRoute, deleteBook);

export default router;
