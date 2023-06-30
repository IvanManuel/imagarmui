import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React from "react"
import { imagarApi } from "@/api"
import Cookies from 'js-cookie';
import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { useState } from 'react';
import { useAuthStore } from '@/hooks';
import { useRouter } from "next/router"
import { LoginLayout } from "@/components/layouts/LoginLayout"

type FormData = {
    email: string;
    password: string;
}

const schema = yup
    .object({
        email: yup.string().required(),
        password: yup.string().required(),
    })
    .required()


const LoginPage = () => {

    const [ showError, setShowError ] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })

    const { startLogin } = useAuthStore();

    const onSubmit = (data: FormData) => {
        startLogin(data);
        router.push('/');
    }


    return (
        <LoginLayout>
            <form onSubmit={handleSubmit(onSubmit)} >
            <Box sx={{ mr: 5, ml: 5 }} >
                <Grid
                    container
                    spacing={2}
                    alignContent='center'
                >
                    <Grid 
                        item 
                        xs={12}
                        sx={{ mb: 2}}
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

                    <Grid item xs={12}>
                        <TextField
                            type='email'
                            label="Correo"
                            variant="filled"
                            fullWidth
                            {...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail

                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            type='password'
                            variant="filled"
                            fullWidth
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

                </Grid>
            </Box>
        </form>
        </LoginLayout>
    )
}

export default LoginPage;