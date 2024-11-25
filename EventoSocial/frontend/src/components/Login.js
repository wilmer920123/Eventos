import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Asegúrate de importar el archivo CSS

const Login = ({ onLogin }) => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [modoRegistro, setModoRegistro] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = modoRegistro ? '/register' : '/login';

        try {
            const response = await axios.post(
                `http://localhost:3002${endpoint}`,
                { usuario, contraseña },
                { withCredentials: true }
            );

            alert(response.data.mensaje);

            if (!modoRegistro) {
                onLogin(); // Llamamos a la función onLogin que actualiza el estado en App.js
                navigate('/crear-evento');
            } else {
                setModoRegistro(false);
                setUsuario('');
                setContraseña('');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Error al procesar la solicitud');
        }
    };

    return (
        <div className="login-container">
            <h2>{modoRegistro ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-btn">
                    {modoRegistro ? 'Registrar' : 'Iniciar Sesión'}
                </button>
            </form>
            <button onClick={() => setModoRegistro(!modoRegistro)} className="toggle-btn">
                {modoRegistro ? 'Ya tengo una cuenta' : 'Crear nueva cuenta'}
            </button>
        </div>
    );
};

export default Login;
