import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Breadcrumb {
  title: string;
  url?: string;
}

interface PageTitleProps {
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  actions,
  breadcrumbs,
  title,
}) => (
  <Box data-testid="page-title" marginBottom={2}>
    {breadcrumbs && (
      <Breadcrumbs data-testid="page-title__breadcrumbs">
        {breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.url) {
            return (
              <Link
                component={RouterLink}
                data-testid="page-title__breadcrumbs__breadcrumb"
                key={breadcrumb.title}
                to={breadcrumb.url}
              >
                {breadcrumb.title}
              </Link>
            );
          }
          return (
            <Typography
              color="text.primary"
              data-testid="page-title__breadcrumbs__breadcrumb"
              key={breadcrumb.title}
            >
              {breadcrumb.title}
            </Typography>
          );
        })}
      </Breadcrumbs>
    )}
    <Grid container>
      <Grid item xs="auto">
        <Typography data-testid="page-title__title" variant="h4">
          {title}
        </Typography>
      </Grid>
      {actions && (
        <Grid
          data-testid="page-title__actions"
          display="flex"
          item
          justifyContent="end"
          xs
        >
          {actions}
        </Grid>
      )}
    </Grid>
  </Box>
);

export default PageTitle;
