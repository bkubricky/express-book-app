const express = require("express");
const path = require("path");
const app = express();
const books = require("./book-data").books;

// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to remove a book
function deleteBookByIsbn(isbn) {
  const index = books.findIndex((book) => book.isbn === isbn);
  if (index !== -1) {
    books.splice(index, 1);
    return true;
  }
  return false;
}

// Route to display all books
app.get("/books", (req, res) => {
  res.render("book-list", { books });
});

app.get("/books/new", (req, res) => {
  res.render("book-form", { books });
});
app.post("/books/:isbn/delete", (req, res) => {
  const { isbn } = req.params;
  const deleted = deleteBookByIsbn(isbn);
  if (deleted) {
    res.redirect("/books");
  } else {
    res.status(404).send("Book not found");
  }
});
app.get("/books/:isbn/edit", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  res.render("book-edit", { book });
});
app.post("/books/:isbn/update", (req, res) => {
  const { isbn } = req.params;
  const index = books.findIndex((b) => b.isbn === isbn);
  console.log(`index = ${index}`);

  if (index === -1) {
    return res.status(404).send("Book not found");
  }

  books[index] = {
    isbn: req.body.isbn,
    title: req.body.title,
    subtitle: req.body.subtitle,
    author: req.body.author,
    published: req.body.published,
    publisher: req.body.publisher,
    pages: parseInt(req.body.pages),
    description: req.body.description,
    website: req.body.website,
  };

  res.redirect(`/books`);
});
// Route to display a single book by ISBN
app.get("/books/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  res.render("book-detail", { book });
});

app.post("/books", (req, res) => {
  const newBook = {
    isbn: req.body.isbn,
    title: req.body.title,
    subtitle: req.body.subtitle,
    author: req.body.author,
    published: req.body.published,
    publisher: req.body.publisher,
    pages: parseInt(req.body.pages),
    description: req.body.description,
    website: req.body.website,
  };

  books.push(newBook);
  // res.send("Book added successfully!");
  res.render("book-list", { books });
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
