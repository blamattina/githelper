import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { DocumentNode } from 'graphql/language/ast';

const PAGE_SIZE = 15;

type Option = {
  label: string;
  value: any;
};

type Config = {
  graphqlQuery: DocumentNode;
  variables?: Record<string, any>;
  makeOptions(data: any): Option[];
};

type Props = {
  label: string;
  onChange: Function;
  sx?: Record<string, any>;
};

export function makeSearchInput({
  graphqlQuery,
  variables,
  makeOptions,
}: Config) {
  return function SearchInput({ onChange, label, sx }: Props) {
    const [query, setQuery] = useState('');

    const { data, loading } = useQuery(graphqlQuery, {
      variables: {
        query,
        pageSize: PAGE_SIZE,
        ...variables,
      },
      skip: !query,
      notifyOnNetworkStatusChange: true,
    });

    const options = makeOptions(data);

    const handleChange = useCallback(
      (event, selectedOption) => {
        onChange(selectedOption);
      },
      [onChange]
    );

    const handleInputChange = useCallback(
      (event) => {
        setQuery(event.target.value);
      },
      [setQuery]
    );
    return (
      <Autocomplete
        options={options}
        onChange={handleChange}
        onInputChange={handleInputChange}
        loading={loading}
        renderInput={(params) => <TextField {...params} label={label} />}
        sx={{ minWidth: 300, maxWidth: 600, ...sx }}
      />
    );
  };
}
