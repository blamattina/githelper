import React, { useCallback, useState } from 'react';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const USER_SEARCH = loader('./queries/user-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  setAuthors: Function;
};

function AuthorInput({ setAuthors }: Props) {
  const [query, setQuery] = useState('');

  const { data = { search: { edges: [] } }, loading } = useQuery(USER_SEARCH, {
    variables: {
      query,
      pageSize: PAGE_SIZE,
    },
    skip: !query,
    notifyOnNetworkStatusChange: true,
  });

  const options = data.search.edges.map((user: any) => {
    return {
      label: `${user.node.name} (${user.node.login})`,
      login: user.node.login,
    };
  });

  const onChange = useCallback(
    (event, selectedUsers) => {
      const authors = selectedUsers.map((u: any) => u.login);
      setAuthors(authors);
    },
    [setAuthors]
  );

  const onInputChange = useCallback(
    (event) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );
  return (
    <Autocomplete
      multiple
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
      loading={loading}
      renderInput={(params) => <TextField {...params} label="Author" />}
      sx={{ minWidth: 300, maxWidth: 600 }}
    />
  );
}

export default AuthorInput;
