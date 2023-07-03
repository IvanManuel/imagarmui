
import { GetServerSideProps, NextPage } from 'next'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography, CardMedia, Stack, CardActions, Button, IconButton } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined, WhatsApp, Mail, Delete, Edit } from '@mui/icons-material';

import { dbUsers } from "@/database";
import { IUser } from "@/interfaces";
import { LoginLayout, MainLayout } from '@/components/layouts';

interface Props {
    user: IUser
}

const UserPage: NextPage<Props> = ({ user }) => {

    if (!user) return (<></>);

    const { firstName, lastName, email, phone, images, bornedAt, coments, privateComents, admin } = user;

    return (
      <LoginLayout>

<Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={(images?.length === 1) ? (images) : ('/no-image.png')}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { firstName } { lastName }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { bornedAt }
          </Typography>

              <IconButton aria-label="llamar">
                <WhatsApp />
                <Typography sx={{ ml: 1 }}>
                  { phone }
                </Typography>
              </IconButton>

              <IconButton aria-label="email">
                <Mail />
                <Typography sx={{ ml: 1 }}>
                  { email }
                </Typography>
              </IconButton>
              <Typography variant="body2" color="text.secondary">
            Comentario
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            { coments }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comentario Privado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            { privateComents }
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent:'end' }}>
          <Button size="small"><Edit /> Editar</Button>
          <Button size="small"><Delete />Borrar</Button>
        </CardActions>
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