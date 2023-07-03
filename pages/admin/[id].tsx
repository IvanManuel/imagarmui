import { ChangeEvent, FC, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { ArrowBack, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { IUser } from '@/interfaces';
import { dbUsers } from '@/database';
import { imagarApi } from '@/api';
import { validations } from '@/utils';
import { RegisterLayout } from '@/components/layouts/RegisterLayout';
import { fileUpload } from '@/helpers';
import { User } from '@/models';
import NextLink from 'next/link';


interface FormData {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    images: string[];
    bornedAt: string;
    admin: boolean;
    coments: string;
    privateComents: string;
}

interface Props {
    user: IUser;
}

const schema = yup
    .object({
        firstName: yup.string().required().min(3, 'Mínimo 3 caracteres!').max(100, '¡Máximo 100 caracteres!'),
        lastName: yup.string().min(3, 'Mínimo 3 caracteres!').max(100, '¡Máximo 100 caracteres!').required(),
        email: yup.string().email('Ingresa un email válido').required('Required'),
        phone: yup.string().required()
            .min(9, 'Son 9 caracteres.')
            .max(9, 'Son 9 caracteres.')
            .matches(validations.onlyNumbers, 'Sólo debe contener números'),
        photo: yup.string(),
        bornedAt: yup.date().required().nullable().min(new Date(1900, 0, 1), 'Debe agregar una fecha válida'),
        coments: yup.string().required()
            .min(3, 'Mínimo 3 caracteres.')
            .max(200, 'Máximo 200 caracteres.'),
        privateComents: yup.string()
            .max(200, 'Máximo 200 caracteres.'),
    })
    .required()

const UserAdminPage: FC<Props> = ({ user }) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [checked, setChecked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormData>({
        defaultValues: user,
        resolver: yupResolver(schema),
    })

    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { files } = target;
        if (!files || files.length === 0) {
            return;
        }

        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push(fileUpload(file))
        }
        const photosUrls = await Promise.all(fileUploadPromises);
        setValue('images', [...getValues('images'), photosUrls[0]], { shouldValidate: true })
    }

    const onDeleteImage = (image: string) => {
        setValue('images',
            getValues('images').filter(img => img !== image),
            { shouldValidate: true }
        );
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const onBack = () => {
        router.push('/')
    }

    const onSubmit = async (form: FormData) => {
        console.log('Click en boton')
        if (form.images.length > 1) return alert('Máximo 1 imagen');
        setIsSaving(true);

        try {

            const { data } = await imagarApi({
                url: 'user/api',
                method: 'PUT', //si tenemos _id actualizarm sino crear
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
                <Typography variant="h1" >Editar usuario </Typography>
                <Typography>{user._id}</Typography>

                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>

                    <Button
                        color="secondary"
                        startIcon={<ArrowBack />}
                        sx={{ width: '150px', mr:1 }}
                        disabled={isSaving}
                        onClick={ onBack }
                    >
                        Volver
                    </Button>
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

                <Grid>
                    <TextField
                        type="checkbox"
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
                                validate: validations.isValidEmail
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

                            <Grid container >
                                {
                                    getValues('images').map(img => (
                                        <Card key={img}>
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

    let user: IUser | null;

    if (id === 'new') {
        //crear un porducto
        const tempProduct = JSON.parse(JSON.stringify(new User()))
        delete tempProduct._id;

        tempProduct.images = ['no-image.png'];
        user = tempProduct;

    } else {
        user = await dbUsers.getUserById(id.toString());
    }

    if (!user) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            user
        }
    }
}

export default UserAdminPage;