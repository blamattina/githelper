import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";

const VIEWER_LOGIN = gql`
  query { 
    viewer { 
      login
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(VIEWER_LOGIN);

  if (loading) return <div>Loading...</div>
  if (error) return <div>ERROR! {error.message}</div>

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Authenticated as {data.viewer.login} on {process.env.REACT_APP_GITHUB_API_URL}</div>
      </header>
    </div>
  );
}

export default App;
