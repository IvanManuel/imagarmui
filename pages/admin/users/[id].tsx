import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { IUser } from '@/interfaces';
import { dbUsers } from '@/database';
import { imagarApi } from '@/api';
import { validations } from '@/utils';
import { RegisterLayout } from '@/components/layouts/RegisterLayout';


interface FormData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    images: string[];
    bornedAt: string;
    coments: string;
    privateComents: string; //Hay que mirar esto para que solo sea string
}

interface Props {
    user: IUser;
}

const UserAdminPage: FC<Props> = ({ user }) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormData>({
        defaultValues: user
    })

    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!target.files || target.files.length === 0) {
            return;
        }

        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await imagarApi.post<{ message: string }>('/admin/upload', formData);
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })

            }
        } catch (error) {
            console.log({ error })
        }
    }

    const onDeleteImage = (image: string) => {
        setValue('images',
            getValues('images').filter(img => img !== image),
            { shouldValidate: true }
        );
    }

    const onSubmit = async (form: FormData) => {
        if (form.images.length < 1) return alert('Mínimo 1 imagen');
        setIsSaving(true);

        try {
            const { data } = await imagarApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST', //si tenemos _id actualizarm sino crear
                data: form
            });

            if (!form._id) {
                router.replace(`/`) 
            } else {
                setIsSaving(false)
            }

        } catch (error) {
            console.log({ error });
            setIsSaving(false);
        }

    }

    return (
        <RegisterLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h1" >Editar usuario</Typography>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                maxLength: { value: 100, message: 'Máximo 3 caracteres' }
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />

                        <TextField
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                maxLength: { value: 100, message: 'Máximo 3 caracteres' }
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />

                        <TextField
                            label="Correo"
                            type='email'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            label="Teléfono"
                            type='tel'
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />

                        <TextField
                            label="F de Nacimiento"
                            type='date'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('bornedAt', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.bornedAt}
                            helperText={errors.bornedAt?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                    </Grid>

                    {/* Tags e imagenes */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Comentarios"
                            variant="filled"
                            fullWidth
                            multiline={true} //multiline esta dando error de re-renderizado
                            sx={{ mb: 1 }}
                            {...register('coments', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.coments}
                            helperText={errors.coments?.message}
                        />

                        <TextField
                            label="Comentarios Privados"
                            variant="filled"
                            fullWidth
                            multiline={true} //multiline esta dando error de re-renderizado
                            sx={{ mb: 1 }}
                            {...register('privateComents', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.privateComents}
                            helperText={errors.privateComents?.message}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>
                            <input
                                ref={fileInputRef}
                                type='file'
                                multiple
                                accept='image/png, image/jpeg, image/jpg, image/gif'
                                style={{ display: 'none' }}
                                onChange={onFilesSelected}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={img}
                                                    alt={img}
                                                />
                                                <CardActions>
                                                    <Button
                                                        fullWidth
                                                        color="error"
                                                        onClick={() => onDeleteImage(img)}
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </RegisterLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const user = await dbUsers.getUserById(id.toString());

    return {
        props: {
            user
        }
    }
}

export default UserAdminPage;