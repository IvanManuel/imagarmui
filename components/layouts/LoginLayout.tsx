import { FC } from "react";
import Head from "next/head"

import { Grid, Typography } from '@mui/material';

interface Props {
  children: React.ReactNode;
  title: string;
  pageDescription: string;
}

export const LoginLayout: FC<Props> = ({ children, title, pageDescription }) => {
  return (
    
    <>
    <Head>
    <title>{ title }</title>
            <meta name="description" content={ pageDescription } />

            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />
    </Head>
    
    <Grid
      container
      spacing={ 0 }
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', backgroundColor: 'secondary.main' }}
    >

      <Grid 
      item
       className='box-shadow'
       sx={{ 
            backgroundColor: 'white', 
            padding: 3, 
            borderRadius: 2 
        }}>
            
            { children }

        </Grid>

    </Grid>

    </>

  )
}