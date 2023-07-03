import { FC, useState, useEffect } from 'react';
import { Grid, Pagination } from '@mui/material';
import { IUser } from "@/interfaces";
import { UserCard } from "./UserCard";

interface Props {
    users: IUser[];
}

const pageSize: number = 5;

export const UserList: FC<Props> = ({ users }) => {

    const usersCount = users.length;
    const [pagination, setPagination] = useState({
        from: 0,
        to: pageSize
    });

    const handlePageChange = ( event: any, page: number) => {
        const from = (page - 1) * pageSize;
        const to = (page - 1) * pageSize + pageSize;

        setPagination({ from, to })
    }

    const onChangePage = () => {
        return users.slice(pagination.from, pagination.to );
    }

    useEffect(() => {
        setPagination({ from: 0, to: pageSize })
    
    }, [users])
    

  return (
    <Grid 
        container 
        alignItems="center"
        justifyContent="center"
        direction="column"
        >
        {
            onChangePage().map( user =>(
                <UserCard 
                    key={ user._id}
                    user={ user }
                />
            ))
        }        
        <Grid
                item
                sx={{ mb: 5 }}
            >
                <Pagination
                count={Math.ceil(usersCount / pageSize )}
                onChange={handlePageChange}
                color='secondary'
            />
            </Grid>
    </Grid>
  )
}
