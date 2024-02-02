const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;
const keySecret = 'secretKey';

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'redsocial',
});

db.connect((err) => {
  if (err) {
    console.log('Error al conectar a MySQL: ' + err.stack);
    return;
  }
  console.log('Conectado a MySQL con el ID ' + db.threadId);
});

// Configuración de Express
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validaciones (puedes agregar más validaciones según sea necesario)

  try {
    // Obtener la contraseña hasheada de la base de datos
    const sql = 'SELECT id, Password FROM users WHERE Email = ?';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario: ' + err.message);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      const user = results[0];
      
      // Comparar la contraseña proporcionada con la contraseña hasheada almacenada
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (passwordMatch) {
        // Generar un token JWT incluyendo el ID del usuario
        const token = jwt.sign({ userId: user.id }, keySecret, { expiresIn: '1h' });
        res.json({login:true, token, user});
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
      }
    });
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, keySecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Ruta protegida
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Ruta protegida', userId: req.userId });
});

//Ruta para guardar los datos
app.post('/register', async (req, res) => {
  const {nombre, edad, email, contra} = req.body;
  try{
    const hashedPassword = await bcrypt.hash(contra, 10);
    const sql = 'INSERT INTO users(FullName, Age, Email, Password) VALUES (?,?,?,?)';
    db.query(sql, [nombre, edad, email, hashedPassword], (err, result)=> {
      if(err){
        console.log(`Error al guardar los datos ${err.message}`);
        res.status(500).json({error: "Error interno del servidor"})
      } else {
        res.json({ mensaje:'Datos guardados con éxito'})
      }
    })
  } catch (error){

  }
})

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});