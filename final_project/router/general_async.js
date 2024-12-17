const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for your API
const API_BASE_URL = 'http://localhost:5000';

// Task 10
router.get('/books', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Server Error');
  }
});

// Task 11
router.get('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  const axios_req = axios.get(`${API_BASE_URL}/books/${isbn}`);
  axios_req.then(response => { return res.json(response.data); })
           .catch(error => { return res.status(500).send("Server Error:" + error.message); });
});


// Task 12
router.get('/books/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${API_BASE_URL}/books/author/${encodeURIComponent(author)}`);
    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).send(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});


// Task 13: Get book details by Title
router.get('/books/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${API_BASE_URL}/books/title/${title}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching books with title ${title}:`, error);
    res.status(500).send('Server Error');
  }
});

module.exports.general_async = router;
