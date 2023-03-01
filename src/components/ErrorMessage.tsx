import { Grid, SvgIconTypeMap, Typography } from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type Props = {
  title: String;
  description?: String;
  Icon?: OverridableComponent<SvgIconTypeMap>;
  color?: 'error' | 'warning' | 'success' | 'info';
};

export function ErrorMessage({
  title,
  description,
  Icon = DangerousIcon,
  color = 'error',
}: Props) {
  return (
    <Grid container direction="column">
      <Grid xs={6} item style={{ textAlign: 'center' }}>
        <Icon sx={{ fontSize: 250 }} color={color} />
      </Grid>
      <Grid xs={6} style={{ textAlign: 'center' }} item>
        <Typography variant="h5">{title}</Typography>
        <br />
        <Typography variant="h6">{description}</Typography>
      </Grid>
    </Grid>
  );
}
