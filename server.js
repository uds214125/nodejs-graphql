const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
const root = {
  hello: () => {
    return 'Hello world!';
    },
};
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4125, () => console.log('Now browse to localhost:4125/graphql'));