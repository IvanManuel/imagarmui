import { useState, useEffect } from 'react';
import NextLink from 'next/link'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { validations } from '@/utils';
import { useAuthStore } from '@/hooks';
import { LoginLayout } from '@/components/layouts';

type FormData = {
    email: string;
    password: string;
}

const schema = yup
    .object({
        email: yup.string().email('Ingresa un email válido').required('Required'),
        password: yup.string()
            .required('No password provided.')
            .min(8, 'Mínimo 8 caracteres.')
            .max(50, 'Máximo 50 caracteres.')
            .matches(validations.passwordRegex, 'Formato de contraseña inválido'),
    })
    .required()


const LoginPage = () => {

    const [showError, setShowError] = useState(false);
    const { startLogin, status } = useAuthStore();

    useEffect(() => {
        status;
    }, [])

    if (status === 'authenticated') {
        <>Debe iniciar sesión <a ref='/user/login'></a></>
    }

    const onSubmit = async (data: FormData) => {
        await startLogin(data);        
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })

    return (
        <LoginLayout title={"Login"} pageDescription={"Inicia sessión para acceder a nuestro panel de usuario"}>
            <form onSubmit={handleSubmit(onSubmit)} >

                <Grid
                    container
                    spacing={2}
                    alignContent='center'
                    justifyContent='center'
                    direction="column"
                >
                    <Grid
                        item
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="h1" >Login</Typography>
                        <Chip
                            label='Este correo ya se encuentra registrado'
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>

                    <Grid item >
                        <TextField
                            type='email'
                            label="Correo"
                            variant="filled"
                            {...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail

                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item>
                        <TextField
                            label="Contraseña"
                            type='password'
                            variant="filled"
                            {...register('password', {
                                required: 'Esta campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='center' sx={{ mb: 1 }}>
                            <Button
                                type='submit'
                                color="secondary"
                                className="circular-btn"
                                size='large'
                            >
                                Login
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item>
                        <Typography>Haz click aquí para </Typography>
                        <NextLink href="/user/register">Registrar</NextLink>
                    </Grid>

                </Grid>

            </form>
        </LoginLayout>
    )
}

export default LoginPage;