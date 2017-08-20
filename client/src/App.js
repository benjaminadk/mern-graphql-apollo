import React, { Component } from 'react';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import Routes from './components/Routes';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { authHeaderMiddleware } from './middleware';

const networkInterface = createNetworkInterface({
  uri: 'http://apollo-react-project-benjaminadk.c9users.io:8081/graphql',
  opts: {
    credentials: 'same-origin',
  }
});

const client = new ApolloClient({
  networkInterface: networkInterface
});

networkInterface.use([authHeaderMiddleware]);

class App extends Component {

  render() {
    return (
        <ApolloProvider client={client}>
          <Routes/>
        </ApolloProvider>
    );
  }
}

export default App;