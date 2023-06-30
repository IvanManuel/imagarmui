
import { GetServerSideProps, NextPage } from 'next'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";

import { dbUsers } from "@/database";
import { IUser } from "@/interfaces";
import { LoginLayout } from '@/components/layouts/LoginLayout';

interface Props {
    user: IUser
}

const UserPage: NextPage<Props> = ({ user }) => {

    if (!user) return (<></>);

    const { firstName = '', lastName, email, phone, bornedAt, coments, privateComents, admin } = user;

    return (
        <LoginLayout>
            {
                (!user)
                    ? (<></>)
                    : (
                        <Grid container sx={{ mt: 3 }} className='fadeIn'>

                            <Card className="sumary-card">
                                <CardContent>

                                    <Box display='flex' justifyContent='space-between'>
                                        <Typography variant='subtitle1'>Datos del Usuario</Typography>
                                    </Box>

                                    <Typography>Nombre Completo: {firstName} {lastName}</Typography>
                                    <Typography>Correo Electrónico: {email}</Typography>
                                    <Typography>Teléfono: {phone} </Typography>
                                    <Typography>Fecha de Nacimiento: {bornedAt}</Typography>
                                    <Typography>Rol: { admin ? 'Admin' : 'Client'}</Typography>
                                    <Typography>Comentarios: {coments}</Typography>
                                    {
                                        (admin === true) && (
                                            <Typography>Comentarios privados: {privateComents}</Typography>
                                        )
                                    }

                                </CardContent>
                            </Card>

                        </Grid>
                    )
            }

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