import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import './Header.css'; // Importamos el archivo CSS del encabezado

function Header({ usuarioAutenticado, onLogout }) {
    return (
        <header className="app-header">
            <img className="logo" src="/img/logo1.png" alt="Logo" />
            <div className="header-text">
                <h1>𝒞ℴ𝓃ℯ𝒸𝓉𝒶𝓃𝒹ℴ ℳℴ𝓂ℯ𝓃𝓉ℴ𝓈, 𝒞𝓇ℯ𝒶𝓃𝒹ℴ ℛℯ𝒸𝓊ℯ𝓇𝒹ℴ𝓈</h1>
            </div>
            <nav className="nav-links">
                <Link to="/" className="nav-link">Inicio</Link>
                {usuarioAutenticado && <Link to="/crear-evento" className="nav-link">Crear Evento</Link>}
                <Link to="/lista-eventos" className="nav-link">Ver Lista de Eventos</Link>
                {!usuarioAutenticado ? (
                    <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                ) : (
                    <button onClick={onLogout} className="nav-link">Cerrar sesión</button>
                )}
            </nav>
        </header>
    );
}

export default Header; // Asegúrate de que esté exportado correctamente
