import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import GitUserChooser from './GitUserChooser';
import Contributions from './Contributions';
import TimeSpanSelect from './time-span/TimeSpanSelect';
import { useTimePeriod } from './time-span/useTimeSpan';
import ReactGA from 'react-ga4';

export type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function GitUserActivityPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/users',
    });
  }, [location.pathname]);

  const { startDate, endDate, timePeriod, setTimePeriod } = useTimePeriod();

  const [author, setAuthor] = useState<AuthorOption>((): AuthorOption => {
    if (params.user) {
      //TODO - This works but won't show name (just username) - how do I return value of these correctly?
      return {
        label: params.user || '',
        login: params.user || '',
        name: params.user || '',
      };
    }

    return null;
  });

  //Handle corner case in state when page transitions
  if (author && params.user === undefined) {
    setAuthor(null);
  } else if (params.user !== author?.name) {
    setAuthor({
      label: params.user || '',
      login: params.user || '',
      name: params.user || '',
    });
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <GitUserChooser
          label="Search by User"
          initialValue={author}
          onChange={(author: AuthorOption) => {
            if (author && author.login) {
              navigate(`/${params.gitHubHostname}/users/${author.login}`);
            } else {
              navigate(`/${params.gitHubHostname}/users`);
            }
            setAuthor(author);
          }}
        />
        <Box>
          <TimeSpanSelect
            timePeriod={timePeriod}
            onTimeSpanChange={setTimePeriod}
          />
        </Box>
      </Box>
      <br />
      {author && (
        <Contributions
          login={author.login}
          name={author.name}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </Box>
  );
}

export default GitUserActivityPage;
