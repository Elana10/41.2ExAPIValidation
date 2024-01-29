/** Common config for bookstore. */


let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `books_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `books`;
}


module.exports = { DB_URI };