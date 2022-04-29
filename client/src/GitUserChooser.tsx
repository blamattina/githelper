import { SyntheticEvent, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { AuthorOption } from './App';
import { loader } from 'graphql.macro';

const USER_SEARCH = loader('./queries/user-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  label: string;
  onChange: Function;
  sx?: Record<string, any>;
  initialValue?: AuthorOption;
};

const GitUserChooser = ({ label, onChange, sx, initialValue }: Props) => {
  const [query, setQuery] = useState('');

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    selectedOption: any
  ) => {
    onChange(selectedOption);
  };

  const handleInputChange = useCallback((event) => {
    if (event) {
      setQuery(event.target.value === 0 ? '' : event.target.value);
    }
  }, []);

  const { data, loading } = useQuery(USER_SEARCH, {
    variables: {
      query,
      pageSize: PAGE_SIZE,
    },
    skip: !query,
    notifyOnNetworkStatusChange: true,
  });

  const isOptionEqualToValue = (option: AuthorOption, value: AuthorOption) => {
    if (option === value || option?.login === value?.login) {
      return true;
    }

    return false;
  };

  let options: any = [];
  let defaultValue = null;
  if (data && data.search && data.search.edges) {
    options = data.search.edges.map((user: any) => ({
      label: `${user.node.name} (${user.node.login})`,
      login: user.node.login,
      name: user.node.name,
    }));
  }

  if (
    initialValue &&
    !options.some(
      (option: AuthorOption) => option?.login === initialValue?.login
    )
  ) {
    defaultValue = {
      label: initialValue.label,
      login: initialValue.login,
      name: initialValue.name,
    };
    options.push(defaultValue);
  }

  let inputValue = '';
  if (query !== '') {
    inputValue = query;
  } else if (initialValue) {
    inputValue = initialValue.label;
  }

  return (
    <Autocomplete
      inputValue={inputValue}
      isOptionEqualToValue={isOptionEqualToValue}
      options={options}
      onChange={handleChange}
      onInputChange={handleInputChange}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={label} />}
      sx={{ minWidth: 300, maxWidth: 600, ...sx }}
    />
  );
};

export default GitUserChooser;
