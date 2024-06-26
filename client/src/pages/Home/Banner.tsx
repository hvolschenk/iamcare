import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useSearch } from '~/src/providers/Search';
import { authentication, userItemsCreate } from '~/src/urls';

const Banner: React.FC = () => {
  const { user } = useAuthentication();
  const { searchDialogOpen } = useSearch();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography marginTop={8} textAlign="center" variant="h3">
          {l10n.applicationName}
        </Typography>
        <Typography
          color="text.secondary"
          marginBottom={8}
          textAlign="center"
          variant="h5"
        >
          {l10n.homeSlogan}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography color="primary" gutterBottom variant="h4">
              {l10n.homeGiveTitle}
            </Typography>
            <Typography gutterBottom variant="h5">
              {l10n.homeGiveSubTitle}
            </Typography>
            <Typography gutterBottom variant="body1">
              {l10n.homeGiveDescription}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              component={Link}
              data-testid="home__banner__create"
              fullWidth
              to={
                user ? userItemsCreate(user.id.toString()) : authentication({})
              }
            >
              {l10n.homeGiveCallToAction}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography color="secondary" gutterBottom variant="h4">
              {l10n.homeTakeTitle}
            </Typography>
            <Typography gutterBottom variant="h5">
              {l10n.homeTakeSubTitle}
            </Typography>
            <Typography gutterBottom variant="body1">
              {l10n.homeTakeDescription}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              color="secondary"
              data-testid="home__banner__search"
              fullWidth
              onClick={searchDialogOpen}
            >
              {l10n.homeTakeCallToAction}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Banner;
