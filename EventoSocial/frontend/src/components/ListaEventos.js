import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './ListaEventos.css';

const ListaEventos = forwardRef((props, ref) => {
    const [eventos, setEventos] = useState([]);
    const [eventoEditado, setEventoEditado] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '', aforo: '', ubicacion: '', marca: '' });

    // Función para cargar los eventos desde el backend
    const cargarEventos = async () => {
        try {
            const response = await axios.get('http://localhost:3002/eventos');
            setEventos(response.data);
        } catch (error) {
            console.error('Error al cargar los eventos:', error);
        }
    };

    // Función para eliminar un evento
    const eliminarEvento = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/eventos/${id}`);
            console.log('Evento Eliminado:', id);
            cargarEventos(); // Recargar los eventos después de eliminar
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
        }
    };

    // Función para manejar la edición de un evento
    const editarEvento = (evento) => {
        setEventoEditado(evento);
        setFormData(evento);
    };

    // Función para manejar la actualización del evento editado
    const actualizarEvento = async (id) => {
        try {
            await axios.put(`http://localhost:3002/eventos/${id}`, formData);
            console.log('Evento Eliminado:', id);
            cargarEventos();
            setEventoEditado(null);
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
        }
    };

    // Función para manejar el cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useImperativeHandle(ref, () => ({
        cargarEventos,
    }));

    useEffect(() => {
        cargarEventos(); // Carga inicial
    }, []);

    return (
        <section>
            <h2>Eventos Creados</h2>
            {eventos.length > 0 ? (
                <table className="tabla-eventos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Aforo</th>
                            <th>Ubicación</th>
                            <th>Organizador</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventos.map((evento) => (
                            <tr key={evento._id}>
                                <td>{evento.nombre}</td>
                                <td>{evento.descripcion}</td>
                                <td>{evento.aforo}</td>
                                <td>{evento.ubicacion}</td>
                                <td>{evento.marca}</td>
                                <td>
                                    <button onClick={() => editarEvento(evento)} className="btn-editar">Editar</button>
                                    <button onClick={() => eliminarEvento(evento._id)} className="btn-eliminar">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay eventos creados.</p>
            )}

            {/* Modal para editar evento */}
            {eventoEditado && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Evento</h3>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                        />
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        />
                        <label>Aforo</label>
                        <input
                            type="number"
                            name="aforo"
                            value={formData.aforo}
                            onChange={handleInputChange}
                        />
                        <label>Ubicación</label>
                        <input
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleInputChange}
                        />
                        <label>Organizador</label>
                        <input
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleInputChange}
                        />
                        <button onClick={() => actualizarEvento(eventoEditado._id)} className="btn-guardar">Guardar</button>
                        <button onClick={() => setEventoEditado(null)} className="btn-cancelar">Cancelar</button>
                    </div>
                </div>
            )}
        </section>
    );
});

export default ListaEventos;
