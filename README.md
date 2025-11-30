# nodejs-graphql
NodeJs GraphQL Demo

# using GraphiQL

# List bookId and authorId
{
  book{
    id,
    authorId
  }
}
# List alias bookId, authorId and book title
{
  books{
    bookdId: id
    authorId
    title
  }
}
# List authorId and author name
{
  books{
    authorId,
    author{
      name
    }
  }
}
# List all authors name
{
  authors{
    name
  }
}
# Add a new book and return book id and title
mutation{
  addBook(title: "Let me C", authorId: 8) {
    id, title
  }
}