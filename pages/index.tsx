
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Grid, Button, Box, Container } from '@mui/material';

import { UiProvider } from '../context/ui/UiProvider';
import { imagarApi } from '@/api';
import { IUser } from '@/interfaces';
import { UserList } from "@/components/user/UserList";
import { MainLayout } from '@/components/layouts';
import { useAuthStore } from '@/hooks';


const HomePage = () => {

  const router = useRouter();
  const { user } = useAuthStore();


  if (!user) {
    router.push('/auth/login')
  }

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    imagarApi.get('user/api').then(
      (res) => {
        setUsers(res.data)
      })
  }, [])

  return (
    <MainLayout title={"Home"} pageDescription={"Web basada en NextJS, Typescript, Redux..."}>
      <Grid item sx={{ mt: 2, mb: 5 }}>
        <UserList users={users} />
      </Grid>
    </MainLayout>
  )
}

export default HomePage