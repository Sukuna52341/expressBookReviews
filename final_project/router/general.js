const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Check if user already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter((book) => book.author === author);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter((book) => book.title === title);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async/await (simulated with Promise)
public_users.get('/async/books', async (req, res) => {
  try {
    // Simulate async with Promise.resolve
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 2));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Task 11: Get book by ISBN using async/await (simulated with Promise)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const getBookByIsbn = (isbn) => Promise.resolve(books[isbn]);
    const book = await getBookByIsbn(isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book by ISBN' });
  }
});

// Task 12: Get books by author using async/await (simulated with Promise)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const getBooksByAuthor = (author) => Promise.resolve(Object.values(books).filter((book) => book.author === author));
    const matchingBooks = await getBooksByAuthor(author);
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: 'No books found for this author' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Task 13: Get books by title using async/await (simulated with Promise)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const getBooksByTitle = (title) => Promise.resolve(Object.values(books).filter((book) => book.title === title));
    const matchingBooks = await getBooksByTitle(title);
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: 'No books found with this title' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books by title' });
  }
});

module.exports.general = public_users;
