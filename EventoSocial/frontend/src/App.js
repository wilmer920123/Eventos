import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrearEvento from './components/CrearEvento';
import ListaEventos from './components/ListaEventos';
import PaginaPrincipal from './components/PaginaPrincipal';
import Login from './components/Login';
import Footer from './components/Footer';
import Header from './components/Header'; // Asegúrate de importar Header correctamente
import './App.css';

function App() {
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

    const handleLogin = () => {
        setUsuarioAutenticado(true);
    };

    const handleLogout = () => {
        setUsuarioAutenticado(false);
    };

    return (
        <Router>
            <div className="app-container">
                <Header usuarioAutenticado={usuarioAutenticado} onLogout={handleLogout} />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<PaginaPrincipal />} />
                        <Route
                            path="/crear-evento"
                            element={
                                usuarioAutenticado ? <CrearEvento /> : <Navigate to="/login" />
                            }
                        />
                        <Route path="/lista-eventos" element={<ListaEventos />} />
                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
