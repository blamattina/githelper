import { SyntheticEvent, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { loader } from 'graphql.macro';
import type { OrganizationOption } from './GitOrgActivityPage';

const ORG_SEARCH = loader('./queries/org-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  label: string;
  onChange: Function;
  initialValue?: OrganizationOption;
};

const GitOrgChooser = ({ label, onChange, initialValue }: Props) => {
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

  const isOrganizationEqual = (
    option: OrganizationOption,
    value: OrganizationOption
  ) => {
    if (option === value || option?.name === value?.name) {
      return true;
    }

    return false;
  };

  const { data, loading } = useQuery(ORG_SEARCH, {
    variables: {
      query: `${query} type:org`,
      pageSize: PAGE_SIZE,
    },
    skip: !`${query} type:org`,
    notifyOnNetworkStatusChange: true,
  });

  let options: any = [];
  let defaultValue = null;
  if (data && data.search && data.search.edges) {
    options = data.search.edges.map((org: any) => ({
      name: org.node.name,
      label: org.node.name,
    }));

    //Handles a case where some git default orgs return duplicates and throw key errors
    var seen: any = {};
    options = options.filter(function (item: any) {
      return seen[item.name] ? false : (seen[item.name] = true);
    });
  }

  if (
    initialValue &&
    !options.some(
      (option: OrganizationOption) => option?.name === initialValue?.name
    )
  ) {
    defaultValue = {
      label: initialValue.label,
      name: initialValue.name,
    };
    options.push(defaultValue);
  }

  let inputValue = '';
  if (query !== '') {
    inputValue = query;
  } else if (initialValue) {
    inputValue = initialValue.name;
  }

  return (
    <Autocomplete
      inputValue={inputValue}
      isOptionEqualToValue={isOrganizationEqual}
      options={options}
      onChange={handleChange}
      onInputChange={handleInputChange}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={label} />}
      sx={{ minWidth: 300, maxWidth: 600, marginRight: 1 }}
    />
  );
};

export default GitOrgChooser;
