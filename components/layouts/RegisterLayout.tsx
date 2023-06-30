import { Grid, Typography } from '@mui/material';


export const RegisterLayout = ({ children, title = '' }) => {
  return (
    
    <Grid
      container
      spacing={ 0 }
      direction="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', backgroundColor: 'secondary.main' }}
    >

      <Grid 
      item
       className='box-shadow'
       xs={ 8 }
       sx={{ 
            backgroundColor: 'white', 
            padding: 3, 
            borderRadius: 2 
        }}>
            
            { children }

        </Grid>

    </Grid>

  )
}