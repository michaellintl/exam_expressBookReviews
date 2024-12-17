const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password && authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in. ");
  } else {
    return res.status(404).json({ message: "Error logging in." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = "userC";
  const review = req.query.review;
  const isbn = req.params.isbn;

  if (review && isbn && username) {
    let book;
    for (let key in books) {
      if (books[key].isbn === isbn) {
        book = books[key];
      }
    }
    if (book) {
      const reviewId = Object.keys(book.reviews).length + 1; // Generate a unique review ID
      book.reviews[reviewId] = { user: username, review: review };
      return res.status(200).json({ message: "Review '" + review + "' of user " + username + " added." });
    }
  }

  return res.status(404).json({ message: "Error sending review." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = "userC";
  const isbn = req.params.isbn;

  if (isbn && username) {
    let book;
    for (let key in books) {
      if (books[key].isbn === isbn) {
        book = books[key];
      }
    }
    if (book) {
      for (let review in book.reviews) {
        if (book.reviews[review].user === username) {
          delete book.reviews[review];
        }
      }
      return res.status(200).json({ message: "Review deleted." });
    }
  }

  return res.status(404).json({ message: "Error sending review." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
