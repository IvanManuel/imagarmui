import { FC } from "react";
import Head from "next/head"

import { Container } from "@mui/material";
import { Navbar, SideMenu } from "../ui";



interface Props {
    children: React.ReactNode;
    title: string;
    pageDescription: string;
    ImageFullUrl?: string;
}

export const MainLayout:FC<Props> = ({ children, title, pageDescription, ImageFullUrl }) => {
  return (
    <>
        <Head>
            <title>{ title }</title>
            <meta name="description" content={ pageDescription } />

            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />

            {
                ImageFullUrl && (
                    <meta name="og:image" content={ ImageFullUrl } />
                )
            }
        </Head>

        <nav>
            <Navbar />
        </nav>

        <SideMenu />

        <Container sx={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px',
            backgroundColor: 'secondary.main'
        }}>
            { children }
        </Container>

        <footer>
        { /* TODO  */}
        </footer>
    </>
  )
}

