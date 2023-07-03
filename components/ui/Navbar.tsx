import NextLink from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { AppBar, Badge, Box, Button, CardMedia, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import { ArrowBackOutlined, WorkOutline, ClearOutlined, SearchOutlined, ShoppingCartOutlined, SchoolOutlined, StadiumOutlined, Person, ExitToApp, Menu } from '@mui/icons-material';
import { UiContext } from "@/context/ui";
import { useAuthStore } from '@/hooks';


export const Navbar = () => {

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
                    <NextLink href='/user/new' passHref legacyBehavior>
                        <Link>
                            <IconButton>
                                <Person />
                                <Button color={asPath === '/user/new' ? 'primary' : 'info'}>Perfil</Button>
                            </IconButton>
                        </Link>
                    </NextLink>

                    <NextLink href='/auth/login' passHref legacyBehavior>
                        <Link>
                            <IconButton onClick={signOut}>
                                <ExitToApp />
                                <Button 
                                    color={asPath === '/category/job' ? 'primary' : 'info'}
                                    >Salir</Button>
                            </IconButton>
                        </Link>
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