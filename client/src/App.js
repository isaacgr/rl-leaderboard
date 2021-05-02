import React, { Component } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Players from "./components/Players";
import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql/",
  cache: new InMemoryCache()
});

export class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            {/* <img
              src={logo}
              alt="SpaceX"
              style={{ width: 200, display: "block", margin: "auto" }}
            /> */}
            <Route exact path="/" component={Players}></Route>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
