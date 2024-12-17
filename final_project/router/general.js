const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password." });
  } else if (!isValid(username)) {
    return res.status(400).json({ message: "Username is not valid" });
  }
  users.push({ "username": username, "password": password });
  return res.json({ message: "User " + username + " registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const parsedBooks = Object.values(books);
  const book = parsedBooks.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "No book found for given ISBN." })
  }
  return res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const parsedBooks = Object.values(books);
  const book = parsedBooks.find(book => book.author === author);
  if (!book) {
    return res.status(404).json({ message: "No book found for given author." })
  }
  return res.send(JSON.stringify(book, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const parsedBooks = Object.values(books);
  const book = parsedBooks.find(book => book.title === title);
  if (!book) {
    return res.status(404).json({ message: "No book found with given title." });
  }
  return res.send(JSON.stringify(book, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const parsedBooks = Object.values(books);
  let book = parsedBooks.find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "No reviews found for given ISBN." })
  }
  return res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
