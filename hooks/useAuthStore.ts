import { useDispatch, useSelector } from 'react-redux';
import { imagarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth';
import { IUser } from '@/interfaces';
import { useRouter } from 'next/router';

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
            dispatch( onLogin({
                uid: data.user._id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                password: data.user.password,
                phone: data.user.phone,
                images: data.user.images,
                bornedAt: data.user.bornedAt,
                admin: data.user.admin,
                coments: data.user.coments,
                privateComents: data.user.privateComents,
                photoURL: data.user.photoURL
            }) );
            
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
            dispatch( onLogin({
                uid: data.user._id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                password: data.user.password,
                phone: data.user.phone,
                images: data.user.images,
                bornedAt: data.user.bornedAt,
                admin: data.user.admin,
                coments: data.user.coments,
                privateComents: data.user.privateComents,
                photoURL: data.user.photoURL
            }) );
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