import { FC } from 'react';

import { Box, Card,CardContent, CardMedia, IconButton, Link, Typography  } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';

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
    router.push(`/user/${user._id}`)
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
      justifyContent='center'
      >
      <CardMedia
        component="img"
        sx={{ width: 220, borderRadius: 2 }}
        image={ ( user.images?.length === 1 ) ? ( user.images ) : ('/no-image.png')  }
        alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto', ml: 2 }}>
          <Typography>Nombre completo: </Typography>
          <Typography component="div" variant="h5">
            { user.firstName } { user.lastName }
          </Typography>
          <Typography>Correo electrónico: </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            { user.email }
          </Typography>
          <Typography>Teléfono: </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            { user.phone }
          </Typography>

          <NextLink href={`/user/${user._id}`}>
        <Link>
        <Typography>+ Detalles </Typography>
        </Link>
    </NextLink>

        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous" onClick={ onClickEdit }>
            <EditOutlined />
            <Typography>Editar</Typography>
          </IconButton>
          <IconButton aria-label="next" >
            <DeleteOutlineOutlined />
            <Typography>Eliminar</Typography>
          </IconButton>
        </Box>
      </Box>

    </Grid>

  );
}