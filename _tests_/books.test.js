const request = require("supertest");

const app = require('../app');
const db = require('../db');
const Book = require('../models/book');



describe("Book Routes Test", function () {

    const book1 = {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
    }
    const book2 = {
        "isbn": "asdf",
        "amazon_url": "http://a.co/eobPtX2234234",
        "author": "Tim",
        "language": "spanish",
        "pages": 999,
        "publisher": "Your mom",
        "title": "Things to do.",
        "year": 1988
    }

    const book3 = {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2234234asdf",
        "author": "Sharon",
        "language": "french",
        "pages": 1,
        "publisher": "Bob",
        "title": "Running Man",
        "year": 2024
    }

    const book4 = {
        "isbn": "qwer",
        "amazon_url": "http://a.co/eobPtX2234234asdf",
        "author": "Sharon",
        "language": "french",
        "pages": '100',
        "publisher": "Bob",
        "title": "Running Man",
        "year": 2024
    }

    beforeEach(async function () {
        await db.query("DELETE FROM books");
        await Book.create(book1);
    });

    test("/GET = can get all", async function () {
        let response = await request(app).get("/books")
        expect(response.body.books.length).toEqual(1);
        expect(response.body.books[0].isbn).toEqual('0691161518');
    })

    test("/GET/:id = can get single book", async function () {
        let response = await request(app).get(`/books/${book1.isbn}`)
        expect(response.body.book.isbn).toEqual(book1.isbn)
    })

    test("/POST - good info", async function () {
        let response = await request(app)
                .post('/books')
                .send(book2)
        
        expect(response.status).toEqual(201);
        expect(response.body.book.isbn).toEqual("asdf")
    })

    test("/POST - duplicate isbn", async function () {
        let response = await request(app)
                .post('/books')
                .send(book3)
        expect(response.status).toEqual(500);
        expect(response.body.message).toEqual('duplicate key value violates unique constraint "books_pkey"')
    })

    test("/POST - pages as string", async function () {
        let response = await request(app)
                .post('/books')
                .send(book4)
        expect(response.status).toEqual(400);

    })

    test("/PUT - pages as string", async function () {
        let response = await request(app)
                .put(`/books/${book1.isbn}`)
                .send(book4)
        expect(response.status).toEqual(400);
        expect(response.body.error.message[0]).toContain('integer');
    })


})

afterAll(async function () {
    await db.end();
  });
  