import { FC } from 'react';

import { Box, Card, CardContent, CardMedia, IconButton, Link, Typography } from '@mui/material';
import { AddCircle, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';

import { Grid } from '@mui/material';
import { IUser } from '@/interfaces';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  user: IUser;
}


export const UserCard: FC<Props> = ({ user }) => {
  const router = useRouter();

  const onClickEdit = () => {
    router.push(`/admin/${user._id}`)
  }

  const onClickProfile = () => {
    router.push(`/profile/${user._id}`)
  }

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        ":hover": {
          backgroundColor: 'rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease-in-out'
        },
        borderRadius: 2,
        mt: 1, mb: 3, ml: 1, mr: 1
      }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, borderRadius: 2 }}
          image={(user.images?.length === 1) ? (user.images) : ('/no-image.png')}
          alt="Live from space album cover"
        />
      </Grid>

      <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
          <Typography>Nombre completo: </Typography>
          <Typography component="div" variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
        </Grid>

        <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
          <Typography>Correo electrónico: </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {user.email}
          </Typography>
          <Typography>Teléfono: </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {user.phone}
          </Typography>
        </Grid>

        <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
          <IconButton aria-label="next" onClick={onClickProfile}>
            <AddCircle />
            <Typography>Detalles</Typography>
          </IconButton>          
        </Grid>

        <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
        <IconButton aria-label="previous" onClick={onClickEdit}>
            <EditOutlined />
            <Typography>Editar</Typography>
          </IconButton>
        </Grid>

        <Grid item sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
        <IconButton aria-label="next" >
            <DeleteOutlineOutlined />
            <Typography>Eliminar</Typography>
          </IconButton>
        </Grid>


    </Grid>

  );
}