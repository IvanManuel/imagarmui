
import { AccountCircleOutlined, AddOutlined, ConfirmationNumberOutlined, DeleteOutlineOutlined, ExitToAppOutlined } from '@mui/icons-material'
import { Chip, Grid, Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IUser } from '@/interfaces';
import { useState, useEffect, FC } from 'react';
import { imagarApi } from '@/api';
import { useAuthStore } from '@/hooks';
import { useRouter } from 'next/router';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'User ID', width: 220 },
    { field: 'firstName', headerName: 'Nombre', width: 120 },
    { field: 'lastName', headerName: 'Apellido', width: 120 },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 100 },
    {
        field: 'role',
        headerName: 'Rol',
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.role === 'admin'
                ? (<Chip variant='outlined' label='Admin' color='success' />)
                : (<p>Usuario</p>)
        }
    },
    { field: 'bornedAt', headerName: 'F Nacimiento', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver detalle',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/users/${row.id}`}>
                    Ver Detalles
                </a>
            )
        }
    },
    {
        field: 'edit',
        headerName: 'Editar',
        renderCell: ({ row }: GridRenderCellParams) => {
            return <a href={`/admin/users/${row.id}`} target='_blank' rel='noreferrer'>
                Editar</a>

        }
    },
    {
        field: 'delete',
        headerName: 'Borrar',
        renderCell: ({ row }: GridRenderCellParams) => {
            return <DeleteOutlineOutlined />
        }
    }
];

const UsersPage: FC = () => {

    const { status, checkAuthToken, startLogout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        checkAuthToken();
    }, [])

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        imagarApi.get('user/update').then(
            (res) => {
                setUsers(res.data)
            })
    }, [])

    if (!users) return (<></>);

    const rows = users!.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bornedAt: user.bornedAt,
        coments: user.coments,
        privateComents: user.privateComents,
        role: user.role,
    }))

    const signOut = () => {
        startLogout();
    }

    return (
        <>
            <Box
                display='flex'
                justifyContent='end'
                sx={{ mt: 1 }}
            >
                <Button
                    startIcon={<AccountCircleOutlined />}
                    color="secondary"
                    href='/auth/login'
                >
                    Perfil
                </Button>
                <Button
                    startIcon={<ExitToAppOutlined />}
                    color="secondary"
                    sx={{ mr: 1, ml: 1 }}
                    onClick={signOut}
                >
                    LogOut
                </Button>
            </Box>

            <Grid container className='fadeIn' sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default UsersPage;