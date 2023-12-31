
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { imagarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth';
import { IUser } from '@/interfaces';


type registerData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    photo: string;
    bornedAt: string;
    coments: string;
    privateComents: string; //Hay que mirar esto para que solo sea string
}

type loginData = {
    email: string;
    password: string;
}

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    const router = useRouter();

    const startRegister = async( form: IUser ) => {
        dispatch( onChecking() );
        try {
            const { data } = await imagarApi.post('user/register', form );
            localStorage.setItem('token', data.token );
            dispatch( onLogin( data ) );
            
        } catch (error) {
            dispatch( onLogout( error.response.data?.msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startLogin = async({ email, password }: loginData) => {
        dispatch( onChecking() );
        try {
            const { data } = await imagarApi.post('user/login',{ email, password });
            localStorage.setItem('token', data.token );
            dispatch( onLogin({ admin: data.admin, _id: data._id }) );
            router.push('/');
        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) {
            dispatch( onLogout() );
            router.push('/user/login');
        }
        
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
        router.push('/user/login');
    }

    return {
        //* Propiedades
        errorMessage,
        status, 
        user, 

        //* Métodos
        startRegister,
        startLogin,
        checkAuthToken,
        startLogout
    }

}