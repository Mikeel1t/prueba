import React, { createContext, useContext, useState, useEffect } from 'react';
import { endpoints } from '../apiConfig';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [tokenExpiration, setTokenExpiration] = useState(null);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setLoggedIn(true);
        setTokenExpiration(obtenerTiempoDeExpiracion(token));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setLoggedIn(false);
        setTokenExpiration(null);
    };

    const obtenerTiempoDeExpiracion = (token) => {
        const { exp } = decodeToken(token);
        return exp * 1000;
    };

    const decodeToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const expirationTime = obtenerTiempoDeExpiracion(token);

            if (Date.now() < expirationTime) {
                setLoggedIn(true);
                setTokenExpiration(expirationTime);
            } else {
                handleLogout();
            }
        }
    }, []);

    const obtenerPublicaciones = async (filtro = '') => {
        try {
            const response = await fetch(endpoints.consultarPost+`?filtro=${filtro}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.result);
            } else {
                console.error('Error al obtener las publicaciones');
                // Manejar el error en consecuencia
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            // Manejar el error en consecuencia
        }
    };

    useEffect(() => {
        obtenerPublicaciones();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout, posts, obtenerPublicaciones }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};