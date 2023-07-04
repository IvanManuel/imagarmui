import NextLink from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { AppBar, Badge, Box, Button, CardMedia, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import { ArrowBackOutlined, WorkOutline, ClearOutlined, SearchOutlined, ShoppingCartOutlined, SchoolOutlined, StadiumOutlined, Person, ExitToApp, Menu, Edit } from '@mui/icons-material';
import { UiContext } from "@/context/ui";
import { useAuthStore } from '@/hooks';
import { useSelector } from 'react-redux';


export const Navbar = () => {

    const { user } = useSelector(state => state.auth);
    console.log({user})

    const { asPath, push } = useRouter();
    const { startLogout } = useAuthStore();
    const { toggleSideMenu } = useContext(UiContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    }

    const signOut = () => {
        startLogout();
    }

    return (
        <AppBar >
            <Toolbar>
                <Box flex={1} />
                <Box flex={1} />

                {/* Pantallas grandes */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className="fadeIn"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleSideMenu}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                onClick={() => setIsSearchVisible(true)}
                                className='fadeIn'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <SearchOutlined />

                            </IconButton>
                        )
                }

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <Menu />
                </IconButton>

                <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className='fadeIn'
                >
                    {/* PERFIL CON HREF CON ID DEL STORE */}

                    <Link href={`/profile/${user._id}`} passHref legacyBehavior> 
                            <IconButton>
                                <Person />
                                <Typography>Perfil</Typography>
                            </IconButton>
                    </Link>

                    <Link href={`/admin/${user._id}`} passHref legacyBehavior> 
                            <IconButton>
                                <Edit />
                                <Typography>Editar Perfil</Typography>
                            </IconButton>
                    </Link>


                    <NextLink href='/user/login' passHref legacyBehavior>

                            <IconButton onClick={signOut}>
                                <ExitToApp />
                                <Typography>Salir</Typography>
                            </IconButton>

                    </NextLink>
                </Box>

                <NextLink href='/' passHref legacyBehavior>
                    <Link>
                        {
                            asPath === '/' ? null :
                                (
                                    <IconButton>
                                        <ArrowBackOutlined />
                                        <Typography>Volver</Typography>
                                    </IconButton>
                                )}
                    </Link>
                </NextLink>

            </Toolbar>
        </AppBar>
    )
}