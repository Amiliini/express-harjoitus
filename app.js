const Joi = require("joi");
const express = require("express");
const { validate } = require("joi/lib/types/lazy");
const { request } = require("express");
const app = express();

//adding middleware to enable parsing of json
app.use(express.json());

const books = [
  { id: 1, name: "Nalle Puh" },
  { id: 2, name: "Halinallet" },
  { id: 3, name: "Harry Potter" },
];

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/api/books", (req, res) => {
  res.send(books);
});

app.post("/api/books", (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = {
    id: books.length + 1,
    name: req.body.name,
  };
  books.push(book);
  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  // Look up the book
  //if not existing, return 404
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res.status(404).send("Book with the given id was not found");
    return;
  }

  /* cleaner version: return res.status(404).send("Book with the given id was not found") but keeping the longer for learning..
  the more elegant way is applied in the next*/

  //validate
  //if invalid, return 400- bad request
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //update book
  book.name = req.body.name;
  //return updated book
  res.send(book);
});

function validateBook(book) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(book, schema);
}

app.delete("/api/books/:id", (req, res) => {
  //Look up the book
  //If doesnt exist, return 404
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("Book with the given id was not found");

  //delete
  const index = books.indexOf(book);
  books.splice(index, 1);
  //return the same book
  res.send(book);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book)
    return res.status(404).send("Book with the given id was not found");
  res.send(book);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
