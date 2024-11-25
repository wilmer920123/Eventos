import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrearEvento.css';

const CrearEvento = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        aforo: '',
        ubicacion: '',
        marca: '',
    });
    const [cargando, setCargando] = useState(true); // Para manejar el estado de carga
    const navigate = useNavigate();

    // Verificar si el usuario tiene sesión activa
    useEffect(() => {
        axios
            .get('http://localhost:3002/sesion', { withCredentials: true })
            .then(() => setCargando(false)) // Sesión válida, quitar el estado de carga
            .catch(() => {
                alert('Debes iniciar sesión para acceder a esta página');
                navigate('/login'); // Redirige al login si no hay sesión
            });
    }, [navigate]);

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3002/eventos', formData, { withCredentials: true });
            alert('Evento creado exitosamente');
            // Limpiar formulario
            setFormData({
                nombre: '',
                descripcion: '',
                aforo: '',
                ubicacion: '',
                marca: '',
            });
        } catch (error) {
            console.error('Error al crear el evento:', error);
            alert('Error al crear el evento. Inténtalo nuevamente.');
        }
    };

    // Mostrar cargando mientras se verifica la sesión
    if (cargando) return <p>Cargando...</p>;

    return (
        <div className="crear-evento-container">
            <h2>Crear Evento</h2>
            <form onSubmit={handleSubmit} className="crear-evento-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del evento:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre del evento"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Ingrese una descripción del evento"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="aforo">Aforo máximo:</label>
                    <input
                        type="number"
                        id="aforo"
                        name="aforo"
                        value={formData.aforo}
                        onChange={handleChange}
                        placeholder="Ingrese el aforo máximo"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ubicacion">Ubicación:</label>
                    <input
                        type="text"
                        id="ubicacion"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        placeholder="Ingrese la ubicación del evento"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Organizador (Marca):</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        placeholder="Ingrese el organizador del evento"
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">Crear Evento</button>
            </form>
        </div>
    );
};

export default CrearEvento;
