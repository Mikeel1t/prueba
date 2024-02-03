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
    const sql = 'SELECT id, Password, FullName, Age, Email FROM users WHERE Email = ?';
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
        let persona = { 'FullName': user.FullName, 'Age': user.Age, 'Email': user.Email, 'id': user.id }

        res.json({ login: true, token, 'user': persona });
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
  const { nombre, edad, email, contra } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contra, 10);
    const sql = 'INSERT INTO users(FullName, Age, Email, Password) VALUES (?,?,?,?)';
    db.query(sql, [nombre, edad, email, hashedPassword], (err, result) => {
      if (err) {
        console.log(`Error al guardar los datos ${err.message}`);
        res.status(500).json({ error: "Error interno del servidor" })
      } else {
        res.json({ mensaje: 'Datos guardados con éxito' })
      }
    })
  } catch (error) {

  }
})

// Ruta para actualizar usuario
app.post('/actualizar-usuario', (req, res) => {
  const { idUsuario, nuevosDatos } = req.body;

  const sql = 'UPDATE users SET FullName = ?, Email = ?, Age = ? WHERE id = ?';
  const params = [nuevosDatos.nombre, nuevosDatos.email, nuevosDatos.edad, idUsuario];

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    } else {
      res.json({ success: true });
    }
  });
});

// empoint guardar post
app.post('/guardar_post', async (req, res) => {
  const { title, content, userId } = req.body;
  try {
    const sql = 'INSERT INTO posts(Title, Content, userId) VALUES (?,?,?)';
    db.query(sql, [title, content, userId], (err, result) => {
      if (err) {
        console.log(`Error al guardar los datos ${err.message}`);
        res.status(500).json({ error: "Error interno del servidor" })
      } else {
        res.json({ mensaje: 'Datos guardados con éxito' })
      }
    })
  } catch (error) {

  }
})

app.get('/consultar_post_all', async (req, res) => {
  try {
     // Obtén el valor del parámetro 'filtro' de la petición GET
     const filtro = req.query.filtro;

     let sql = 'SELECT p.Title, p.Content, p.Likes, u.FullName, p.id, p.createdAt FROM posts p JOIN users u ON u.id = p.userId';
 
     if (filtro && filtro.trim() !== '') {
       sql += ` WHERE p.Title LIKE '%${filtro}%' OR p.Content LIKE '%${filtro}%'`;
     }
    sql += ' order by p.id desc';
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(`Error al consultar los datos ${err.message}`);
        res.status(500).json({ error: "Error interno del servidor" })
      } else {
        res.json({ result })
      }
    })
  } catch (error) {

  }
})

// Ruta para actualizar like
app.post('/actualizar_like', (req, res) => {
  const { id, like } = req.body;

  const sql = 'UPDATE posts SET Likes = ?  WHERE id = ?';
  const params = [like, id];

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error al actualizar el post:', error);
      res.status(500).json({ error: 'Error al actualizar el post' });
    } else {
      res.json({ success: true });
    }
  });
});

// Ruta para actualizar post
app.post('/actualizar_post', (req, res) => {
  const { id, nuevosDatos } = req.body;

  const sql = 'UPDATE posts SET Title = ?, Content = ?  WHERE id = ?';
  const params = [nuevosDatos.Title, nuevosDatos.Content, id];

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error al actualizar el post:', error);
      res.status(500).json({ error: 'Error al actualizar el post' });
    } else {
      res.json({ success: true });
    }
  });
});
//Ruta eliminar post
app.post('/eliminar_post', (req, res) => {
  const { id } = req.body;

  const sql = 'DELETE FROM posts WHERE id = ?';
  const params = [id];

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error al actualizar el post:', error);
      res.status(500).json({ error: 'Error al actualizar el post' });
    } else {
      res.json({ success: true });
    }
  });
});

app.get('/consultar_post_id', async (req, res) => {
  try {
    const { id } = req.body;
    const sql = 'SELECT * FROM posts p WHERE p.id = ?';
    db.query(sql, [], (err, result) => {
      if (err) {
        console.log(`Error al consultar los datos ${err.message}`);
        res.status(500).json({ error: "Error interno del servidor" })
      } else {
        res.json({ result })
      }
    })
  } catch (error) {

  }
})

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});