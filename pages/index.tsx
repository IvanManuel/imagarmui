import { UserCard } from "@/components/user/UserCard"
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { IUser } from '@/interfaces';
import { imagarApi } from '@/api';
import { UserList } from "@/components/user/UserList";


const HomePage = () => {

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        imagarApi.get('user/update').then(
            (res) => {
                setUsers(res.data)
            })
    }, [])
    
  return (
    <>
     <Grid
      container
      spacing={ 0 }
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', 
      backgroundColor: 'secondary.main' }}
    >
        
    <UserList users={ users } />

    </Grid>
    </>
  )
}

export default HomePage