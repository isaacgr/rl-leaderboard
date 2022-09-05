const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const cors = require("cors");
const path = require("path");

const app = express();

// Allow cross-origin

// app.use(cors());

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.use(express.static("build"));

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
