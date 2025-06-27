const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/Book");
require("dotenv").config();

// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(`${process.env.MONGODB_URI}`);

console.log(process.env.MONGO_URI);

// Helper function to remove a book

app.get("/", (req, res) => {
  res.redirect("/books");
});
// Route to display all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.render("book-list", { books });
});

app.get("/books/new", (req, res) => {
  res.render("book-form");
});
app.post("/books/:isbn/delete", async (req, res) => {
  const { isbn } = req.params;
  await Book.deleteOne({ isbn: isbn });
  res.redirect("/books");
});
app.get("/books/:isbn/edit", async (req, res) => {
  const { isbn } = req.params;
  const book = await Book.find({ isbn: isbn });
  console.log(book);

  // const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  res.render("book-edit", { book: book[0] });
});
app.post("/books/:isbn/update", async (req, res) => {
  const { isbn } = req.params;
  await Book.findOneAndUpdate({ isbn: isbn }, req.body);
  res.redirect(`/books`);
});
// Route to display a single book by ISBN
app.get("/books/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const book = await Book.find({ isbn: isbn });
  res.render("book-detail", { book: book[0] });
});

app.post("/books", async (req, res) => {
  await Book.create(req.body);

  res.redirect("/books");
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
