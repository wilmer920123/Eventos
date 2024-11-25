const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configuración de MongoDB
mongoose.set('strictQuery', true);

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(
    session({
        secret: 'mi_secreto', // Cambia esto a algo más seguro en producción
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // Cambiar a true si usas HTTPS
            sameSite: 'lax',
        },
    })
);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Modelo de Usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
}));

// Middleware para verificar sesión
function verificarSesion(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    } else {
        res.status(401).json({ error: 'Debes iniciar sesión para realizar esta acción.' });
    }
}

// Ruta raíz para verificar el servidor
app.get('/', (req, res) => {
    res.send('<h1>Servidor funcionando correctamente</h1>');
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { usuario, contraseña } = req.body;
    try {
        const nuevoUsuario = new Usuario({ usuario, contraseña });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario. Puede que el usuario ya exista.' });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body;
    try {
        const usuarioEncontrado = await Usuario.findOne({ usuario, contraseña });
        if (!usuarioEncontrado) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        req.session.usuario = usuario;
        res.json({ mensaje: 'Sesión iniciada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ mensaje: 'Sesión cerrada' });
});

// Ruta para verificar la sesión activa
app.get('/sesion', (req, res) => {
    if (req.session && req.session.usuario) {
        res.json({ usuario: req.session.usuario });
    } else {
        res.status(401).json({ error: 'No hay sesión activa' });
    }
});
// Modelo de Evento
const Evento = mongoose.model('Evento', new mongoose.Schema({
    nombre: String,
    descripcion: String,
    aforo: Number,
    ubicacion: String,
    marca: String,
}));
// Ruta protegida para crear eventos
// Obtener todos los eventos
app.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.find();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los eventos' });
    }
});

// Crear un nuevo evento
app.post('/eventos', async (req, res) => {
    try {
        const nuevoEvento = new Evento(req.body);
        await nuevoEvento.save();
        res.status(201).json(nuevoEvento);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el evento' });
    }
});

// Editar un evento por ID
app.put('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eventoActualizado = await Evento.findByIdAndUpdate(id, req.body, { new: true });
        if (!eventoActualizado) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json(eventoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el evento' });
    }
});

// Eliminar un evento por ID
app.delete('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eventoEliminado = await Evento.findByIdAndDelete(id);
        if (!eventoEliminado) return res.status(404).json({ error: 'Evento no encontrado' });
        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el evento' });
    }
});
// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
