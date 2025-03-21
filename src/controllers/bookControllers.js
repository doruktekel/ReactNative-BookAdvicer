import cloudinary from "../lib/cloudinaryConnect.js";
import BookModel from "../models/bookModel.js";

const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all blankets" });
    }

    const uploadRes = await cloudinary.uploader.upload(image);
    const uploadUrl = uploadRes.secure_url;

    const newBook = await BookModel.create({
      title,
      caption,
      rating,
      image: uploadUrl,
      user: req.user._id,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error in create book controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const skip = (page - 1) * limit;

    const allBooks = await BookModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    if (allBooks.length === 0) {
      return res
        .status(404)
        .json({ message: "Could not find any books to show !" });
    }

    const totalBooks = await BookModel.countDocuments();

    res.status(200).json({
      allBooks,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all book controller", error);
    res.status(500).json("Internal server error");
  }
};

const getBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const books = await BookModel.find({
      user: userId,
    }).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.log("Error in get books controller", error);
    res.status(500).json("Internal server error");
  }
};

const deleteBook = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json({ message: "Could not find any books to delete !" });
    }
    const wantDeleteBook = await BookModel.findById(id);
    if (!deleteBook) {
      return res
        .status(404)
        .json({ message: "Could not find any books to delete !" });
    }

    if (loggedUserId.toString() !== wantDeleteBook.user.toString()) {
      return res
        .status(404)
        .json({ message: "Users can delete only own books !" });
    }

    if (wantDeleteBook.image && wantDeleteBook.image.includes("cloudinary")) {
      try {
        // const publicId = wantDeleteBook.image.split("/").pop().split(".")[0];
        // await cloudinary.uploader.destroy(publicId);

        // try this

        await cloudinary.uploader.destroy(wantDeleteBook.image.public_id);
      } catch (error) {
        console.log("Error in cloudinary deleting", error);
      }
    }

    await BookModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error in delete book controller", error);
    res.status(500).json("Internal server error");
  }
};

export { createBook, getBooks, getAllBooks, deleteBook };
