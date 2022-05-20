import { SyntheticEvent, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { RepoOption } from './GitRepoActivityPage';
import { loader } from 'graphql.macro';

const REPO_SEARCH = loader('./queries/repo-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  label: string;
  onChange: Function;
  sx?: Record<string, any>;
  initialValue?: RepoOption;
};

const GitRepoChooser = ({ label, onChange, sx, initialValue }: Props) => {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (event: SyntheticEvent<Element, Event> | null, selectedOption: any) => {
      onChange(selectedOption);
      setQuery('');
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (event) => {
      if (event) {
        setQuery(event.target.value === 0 ? '' : event.target.value);
        if (event.target.value === '') {
          handleChange(null, '');
        }
      }
    },
    [handleChange]
  );

  const { data, loading } = useQuery(REPO_SEARCH, {
    variables: {
      query,
      pageSize: PAGE_SIZE,
    },
    skip: !query,
    notifyOnNetworkStatusChange: true,
  });

  const isOptionEqualToValue = (option: RepoOption, value: RepoOption) => {
    if (option === value || option?.name === value?.name) {
      return true;
    }

    return false;
  };

  let options: any = [];
  let defaultValue = null;
  if (data && data.search && data.search.edges) {
    options = data.search.edges.map((repo: any) => ({
      label: `${repo.node.owner.login}/${repo.node.name}`,
      login: repo.node.owner.login,
      name: repo.node.name,
    }));
  }

  if (
    initialValue &&
    !options.some((option: RepoOption) => option?.name === initialValue?.name)
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

export default GitRepoChooser;
