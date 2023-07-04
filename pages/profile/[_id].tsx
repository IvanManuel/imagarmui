
import { GetServerSideProps, NextPage } from 'next'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography, CardMedia, Stack, CardActions, Button, IconButton } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined, WhatsApp, Mail, Delete, Edit, ArrowBack } from '@mui/icons-material';

import { dbUsers } from "@/database";
import { IUser } from "@/interfaces";
import { LoginLayout, MainLayout } from '@/components/layouts';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

interface Props {
  user: IUser
}

const UserPage: NextPage<Props> = ({ user }) => {

  if (!user) return (<></>);
  const router = useRouter();
  const { user: userState } = useSelector(state => state.auth);

  const { firstName, lastName, email, phone, images, bornedAt, coments, privateComents, admin } = user;

  const onBack = () => {
    router.push('/')
  }

  const onClickEdit = () => {
    router.push(`/admin/${user._id}`)
  }

  return (
    <LoginLayout>

      <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>

        <Button
          color="secondary"
          startIcon={<ArrowBack />}
          sx={{ width: '150px', mr: 1 }}
          onClick={onBack}
        >
          Volver
        </Button>

      </Box>

      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={(images?.length === 1) ? (images) : ('/no-image.png')}
          title="imageDefault"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bornedAt}
          </Typography>

          <IconButton aria-label="llamar">
            <WhatsApp />
            <Typography sx={{ ml: 1 }}>
              {phone}
            </Typography>
          </IconButton>

          <IconButton aria-label="email">
            <Mail />
            <Typography sx={{ ml: 1 }}>
              {email}
            </Typography>
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Comentario
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {coments}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comentario Privado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {privateComents}
          </Typography>
        </CardContent>
        {
          (userState.admin) && (
            <CardActions sx={{ justifyContent: 'end' }}>
              <Button size="small" onClick={ onClickEdit }><Edit /> Editar</Button>
              <Button size="small"><Delete />Borrar</Button>
            </CardActions>
          )
        }
      </Card>

    </LoginLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { _id = '' } = query;

  console.log({ query })

  const user = await dbUsers.getUserById(_id.toString());


  return {
    props: {
      user
    }
  }
}

export default UserPage;