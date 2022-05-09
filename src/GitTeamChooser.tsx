import { SyntheticEvent, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import type { OrganizationOption, TeamOption } from './GitOrgActivityPage';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { loader } from 'graphql.macro';

const TEAM_SEARCH = loader('./queries/team-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  organization: OrganizationOption;
  label: string;
  onChange: Function;
  initialValue?: TeamOption | null;
};

const GitTeamChooser = ({
  organization,
  label,
  onChange,
  initialValue,
}: Props) => {
  const [query, setQuery] = useState(() => {
    if (initialValue) {
      return initialValue.name;
    }
    return '';
  });

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

  const isTeamEqual = (option: TeamOption, value: TeamOption) => {
    if (option === value || option?.name === value?.name) {
      return true;
    }

    return false;
  };

  const { data, loading } = useQuery(TEAM_SEARCH, {
    variables: {
      org: organization?.name,
      query,
      pageSize: PAGE_SIZE,
    },
    skip: !`${query} type:org`,
    notifyOnNetworkStatusChange: true,
  });

  let options: any = [];
  let defaultValue = null;
  if (
    data &&
    data.organization &&
    data.organization.teams &&
    data.organization.teams.edges
  ) {
    options = data.organization.teams.edges.map((team: any) => ({
      name: team.node.name,
      label: team.node.name,
    }));
  }

  if (
    initialValue &&
    !options.some((option: TeamOption) => option?.name === initialValue?.name)
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
      isOptionEqualToValue={isTeamEqual}
      options={options}
      onChange={handleChange}
      onInputChange={handleInputChange}
      loading={loading}
      renderInput={(params) => <TextField {...params} label={label} />}
      sx={{ minWidth: 300, maxWidth: 600 }}
    />
  );
};

export default GitTeamChooser;
