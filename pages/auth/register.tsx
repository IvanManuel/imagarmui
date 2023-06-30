import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React from "react"
import { imagarApi } from "@/api"
import axios from "axios"
import { Box, Button, Grid, Link, TextField, Typography, Chip, Checkbox } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useState } from 'react';
import { validations } from '@/utils';
import { isValidToken } from '../../utils/jwt';
import { useAuthStore } from "@/hooks"
import { useRouter } from "next/router"
import { RegisterLayout } from "@/components/layouts/RegisterLayout"

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    admin: boolean;
    phone: string;
    photo: string;
    bornedAt: string;
    coments: string;
    privateComents: string; //Hay que mirar esto para que solo sea string
}

const schema = yup
    .object({
        firstName: yup.string().required().min(3, 'Mínimo 3 caracteres!').max(100, '¡Máximo 100 caracteres!'),
        lastName: yup.string().min(3, 'Mínimo 3 caracteres!').max(100, '¡Máximo 100 caracteres!').required(),
        email: yup.string().email('Ingresa un email válido').required('Required'),
        password: yup.string()
        .required('No password provided.') 
        .min(8, 'Mínimo 8 caracteres.')
        .max(50, 'Máximo 50 caracteres.')
        .matches(validations.passwordRegex, 'La contraseña debe contener un mínimo de 8 dígitos y al menos: una letra mayúscula: A-Z, una letra minúscula: a-z, un número: 0-9 y un símbolo: # ! , . %'),
        passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Contraseñas no corresponden'),
        phone: yup.string().required()
        .min(9, 'Mínimo 8 caracteres.')
        .max(10, 'Máximo 50 caracteres.')
        .matches(validations.onlyNumbers, 'Sólo debe contener números'),
        photo: yup.string(),
        bornedAt: yup.string().required(),
        coments: yup.string().required(),
        privateComents: yup.string()
    })
    .required()


const RegisterPage = () => {

    const [showError, setShowError] = useState(false);
    const [checked, setChecked] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })

    const { startRegister } = useAuthStore();

    const onSubmit = (data: FormData) => {
        startRegister(data);
        console.log('DATA', data)
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <RegisterLayout>

            <form onSubmit={handleSubmit(onSubmit)} >
                <Box sx={{ mr: 5, ml: 5 }} >

                    <Grid
                        item
                        xs={12} sm={6}
                        sx={{ mt: 5, mb: 2 }}
                    >
                        <Typography variant="h1" >Registro</Typography>
                        <Chip
                            label='Este correo ya se encuentra registrado'
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>

                    <Grid
                            item
                            xs={12} sm={6}
                        >
                            <TextField
                                type="checkbox"
                                label="Rol"
                                variant="filled"
                                {...register('admin', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                })}
                                error={!!errors.admin}
                                helperText={errors.admin?.message}
                            />
                            <Typography>Marque si el usuario es administrador</Typography>
                        </Grid>

                    <Grid
                        container
                        spacing={2}
                    >                        

                        <Grid
                            item
                            xs={12} sm={6}
                        >
                            <TextField
                                label="Nombre"
                                variant="filled"
                                fullWidth
                                {...register('firstName', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Apellido"
                                variant="filled"
                                fullWidth
                                {...register('lastName', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type='email'
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isValidEmail,
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Esta campo es requerido',
                                    validate: validations.isValidPassword,
                                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Repetir Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('passwordConfirmation', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                error={!!errors.passwordConfirmation}
                                helperText={errors.passwordConfirmation?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Teléfono'
                                variant="filled"
                                fullWidth
                                {...register('phone', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 9, message: 'Mínimo 9 caracteres' },
                                    maxLength: { value: 10, message: 'Son 9 caracteres' }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Fecha de Nacimiento'
                                type="date"
                                variant="filled"
                                fullWidth
                                {...register('bornedAt', {
                                    required: 'Esta campo es requerido'
                                })}
                                error={!!errors.bornedAt}
                                helperText={errors.bornedAt?.message}
                            />
                        </Grid>

                        {/* Images */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Imagen'
                                variant="filled"
                                fullWidth
                                {...register('photo')}
                                error={!!errors.photo}
                                helperText={errors.photo?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Comentario'
                                type="textarea"
                                variant="filled"
                                fullWidth
                                multiline
                                {...register('coments', {
                                    required: 'Esta campo es requerido',
                                    minLength: { value: 4, message: 'Mínimo 4 caracteres' },
                                    maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                                })}
                                error={!!errors.coments}
                                helperText={errors.coments?.message}
                            />
                        </Grid>

                        {
                            ( checked )
                            ? (
                                <Grid item xs={12} sm={6}>
                            <TextField
                                label='Comentario Privado'
                                type="textarea"
                                variant="filled"
                                fullWidth
                                multiline
                                {...register('privateComents', {
                                    minLength: { value: 4, message: 'Mínimo 4 caracteres' },
                                    maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                                })}
                                error={!!errors.privateComents}
                                helperText={errors.privateComents?.message}
                            />
                        </Grid>
                            )
                            : ( <></>)
                        }
                        
                    </Grid>

                    <Box display='flex' alignItems='center'  sx={{ mt: 1, mb: 1 }}>
                    <Typography>Añadir comentario privado</Typography>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    </Box>

                    <Box display='flex' justifyContent='center' sx={{ mb: 1 }}>
                        <Button
                            type='submit'
                            color="secondary"
                            className="circular-btn"
                            size='large'
                        >
                            Registrar
                        </Button>
                    </Box>
                </Box>
            </form>
        </RegisterLayout>
    )
}

export default RegisterPage;