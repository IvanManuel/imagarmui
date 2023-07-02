import { FC } from "react"
import { Grid } from '@mui/material';
import { IUser } from "@/interfaces";
import { UserCard } from "./UserCard";

interface Props {
    users: IUser[];
}

export const UserList: FC<Props> = ({ users }) => {
  return (
    <Grid spacing={4}>
        {
            users.map( user =>(
                <UserCard 
                    key={ user._id}
                    user={ user }
                />
            )

            )
        }        
    </Grid>
  )
}
