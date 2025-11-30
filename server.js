const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = require('graphql');

// step-1: create some sample data
const Authors = [
  { id: 1, name: 'Suzanne Collins' },
  { id: 2, name: 'Kate Chopin' },
  { id: 3, name: 'Paul Auster' },
  { id: 4, name: 'F. Scott Fitzgerald' },
  { id: 5, name: 'George Orwell' },
  { id: 6, name: 'Harper Lee' },
  { id: 7, name: 'Jane Austen' },
  { id: 8, name: 'Uds' }
];
const Books = [
  {
    id: 11,
    title: 'The Hunger Games',
    authorId: 1
  },
  {
    id: 12,
    title: 'The Awakening',
    authorId: 2
  },
  {
    id: 13,
    title: 'City of Glass',
    authorId: 3 
  },
  {
    id: 14,
    title: 'The Great Gatsby',
    authorId: 4
  },
  {
    id: 15,
    title: '1984',
    authorId: 5
  },
  {
    id: 16,
    title: 'To Kill a Mockingbird',
    authorId: 6
  },
  {
    id: 17,
    title: 'Pride and Prejudice',
    authorId: 7
  }
];

// step-2: define your author, book schema here
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  })
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return Authors.find(author => author.id === book.authorId);
      }
    }
  })
});

// step-3: define your books query here
const BookQueryType = new GraphQLObjectType({
  name: 'BooksQuery',
  description: 'Book Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => Books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(BookType))),
      description: 'List of All Books',
      resolve: () => Books
    },
    authors: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AuthorType))),
      description: 'List of All Authors',
      resolve: () => Authors
    }
  })
});
// step-5: create your mutations here
const BooksMutationType = new GraphQLObjectType({
  name: 'BookMutation',
  description: 'Books Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a Book',
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = {
          id: Books.length + 11,
          title: args.title,
          authorId: args.authorId
        };
        Books.push(book);
        return book;
      }
    }
  })
});

// step-4: create your schema here
const BookSchema = new GraphQLSchema({
  query: BookQueryType,
  mutation: BooksMutationType
});
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello world!',
    },
  },
});
// Alternative simple schema
const RootSchema = new GraphQLSchema({ query: RootQueryType });
// bind express with your schema
app.use('/graphql', graphqlHTTP({
  schema: BookSchema,
  graphiql: true
}));
app.use('/', graphqlHTTP({
  schema: RootSchema,
  graphiql: true,
  rootValue: { hello: () => 'Hello world!' },
}));
app.listen(4125, () => console.log('Now browse to localhost:4125/graphql'));