import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';
import PrTable from './PrTable';

const VIEWER_LOGIN = gql`
  query {
    viewer {
      login
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(VIEWER_LOGIN);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR! {error.message}</div>;

  return (
    <div className="App">
      <div>
        Authenticated as {data.viewer.login} on{' '}
        {process.env.REACT_APP_GITHUB_API_URL}
      </div>
      <PrTable authors={[data.viewer.login]} />
    </div>
  );
}

export default App;
