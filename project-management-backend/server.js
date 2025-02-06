const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const API_URL = 'http://192.168.188.109:5000';

console.log(API_URL);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const jwtToken = process.env.JWT_SECRET


const app = express();
// app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
  origin: '*',  // Permite toate originile
};
app.use(cors(corsOptions));


// PROJECTS
app.get('/projects', async (req, res) => {
  console.log('getting projects...');
  try {
    const query = `SELECT * FROM projects ORDER BY updated_at`;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Project not found');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/projects', async (req, res) => {
  const { name, description, category_id, manager_id, deadline } = req.body;
  // console.log('Received project data:', req.body);  // Verifică dacă datele sunt primite
  try {
    const result = await pool.query(
      `INSERT INTO projects (name, description, category_id, manager_id, deadline) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, description, category_id, manager_id, deadline]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).send('Server Error');
  }
});

app.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    
    res.status(200).send({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Server Error');
  }
});

app.put('/projects/:id', async (req, res) => {
  const { id, name, description, category_id, status, deadline } = req.body;

// console.log('Received project data: id ', id, " data ", name, description, category_id, status, deadline);
  const deadlineValue = deadline === "" ? null : deadline;  
  
  try {
    const existingProject = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (existingProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await pool.query(
      'UPDATE projects SET name = $1, description = $2, category_id = $3, status = $4, deadline = $5 WHERE id = $6',
      [name, description, category_id, status, deadlineValue, id]
    );

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});


// CATEGORIES
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/categories', async (req, res) => {
  const { title } = req.body;
  // console.log('Received category data:', req.body);  
  try {
    const result = await pool.query(
      `INSERT INTO categories (title) VALUES ($1) RETURNING *`,
      [title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).send('Server Error');
  }
});


//USER
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const bcrypt = require('bcrypt');

app.post('/users', async (req, res) => {
  const { email, name, role, tel, password } = req.body;
  // console.log('Received user data:', req.body);
  
  try {
    const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ field: 'email', error: 'User with this email already exists' });
    }
  
    const checkTel = await pool.query('SELECT * FROM users WHERE tel = $1', [tel]);
    if (checkTel.rows.length > 0) {
      return res.status(400).json({ field: 'tel', error: 'User with this phone number already exists' });
    }

    const result = await pool.query(
      `INSERT INTO users (email, name, role, tel, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [email, name, role, tel, password]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Server Error');
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // await pool.query('DELETE FROM users WHERE id = $1', [id]);
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Server Error');
  }
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params; 
  const { email, name, role, tel, location, status } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const fieldsToUpdate = [];
    const values = [];

    if (email) {
      fieldsToUpdate.push('email = $' + (fieldsToUpdate.length + 1));
      values.push(email);
    }
    if (name) {
      fieldsToUpdate.push('name = $' + (fieldsToUpdate.length + 1));
      values.push(name);
    }
    if (role) {
      fieldsToUpdate.push('role = $' + (fieldsToUpdate.length + 1));
      values.push(role);
    }
    if (tel) {
      fieldsToUpdate.push('tel = $' + (fieldsToUpdate.length + 1));
      values.push(tel);
    }
    if (location) {
      fieldsToUpdate.push('location = $' + (fieldsToUpdate.length + 1));
      values.push(location);
    }
    if (status) {
      fieldsToUpdate.push('status = $' + (fieldsToUpdate.length + 1));
      values.push(status);
    }

    values.push(id);

    const updateQuery = 'UPDATE users SET ' + fieldsToUpdate.join(', ') + ' WHERE id = $' + (values.length);

    await pool.query(updateQuery, values);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});


// const JWT_SECRET = pool.jwtToken; 

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
    try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid password' });
    // }
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const { password: _, ...userData } = user;

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtToken, { expiresIn: '30d' });
    
    res.json({ userData, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const verifyToken = (req, res, next) => {
  // const token = req.header('Authorization')?.replace('Bearer ', ''); // Obține token-ul din antet

  const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: 'Access denied. No token provided.' });
}
const token = authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verifică token-ul
    const decoded = jwt.verify(token, jwtToken);
    req.user = decoded; // Salvează datele decodificate ale utilizatorului în `req.user`
    next(); // Continuă cu rutele protejate
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// app.post('/change-password', async (req, res) => {
//   const { userId, oldPassword, newPassword } = req.body;

//   try {
//     // 1️⃣ Verifică dacă userul există
//     const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

//     if (userQuery.rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const user = userQuery.rows[0];

//     // 2️⃣ Compară parola veche cu cea stocată
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: 'Old password is incorrect' });
//     }

//     // 3️⃣ Verifică regulile parolei noi
//     if (newPassword.length < 8) {
//       return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
//     }

//     // 4️⃣ Hash-uiește noua parolă și actualizează în baza de date
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

//     res.json({ success: true, message: 'Password changed successfully' });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });





app.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // 1️⃣ Verifică dacă userul există
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userQuery.rows[0];

    // 2️⃣ Compară parola veche cu cea stocată
    const isMatch = oldPassword === user.password;
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    // 3️⃣ Verifică regulile parolei noi
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    if(newPassword === oldPassword){
      return res.status(400).json({ success: false, message: 'New password must be different from old password.' });
    }

    // 4️⃣ Hash-uiește noua parolă și actualizează în baza de date
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// Exemplu de rută protejată
app.get('/profile', verifyToken, (req, res) => {
  // Accesează datele utilizatorului decodificate din token
  const userId = req.user.userId;
  // Poți folosi `userId` pentru a obține datele complete ale utilizatorului din baza de date
  res.json({ message: 'User profile', userId });
});




// TASKS
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY updated_at');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/tasks/project/:id', async (req, res) => {
  const { id } = req.params;
    try {
    const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1', [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});


app.post('/tasks', async (req, res) => {
  const { title, description, project_id, priority, assigned_to, deadline } = req.body;
// console.log('Received task data:', req.body);  
  try {
    const status = 'new';
    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id, priority, assigned_to, deadline, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
      [title, description, project_id, priority, assigned_to, deadline, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send('Server Error');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Server Error');
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params; 
  const { title, description, priority, status, deadline, assigned_to } = req.body;

  try {
    // Verificăm dacă task-ul există
    const existingTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existingTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Construim dinamic câmpurile de actualizat
    const fieldsToUpdate = [];
    const values = [];

    if (title) {
      fieldsToUpdate.push(`title = $${fieldsToUpdate.length + 1}`);
      values.push(title);
    }
    if (description) {
      fieldsToUpdate.push(`description = $${fieldsToUpdate.length + 1}`);
      values.push(description);
    }
    if (priority) {
      fieldsToUpdate.push(`priority = $${fieldsToUpdate.length + 1}`);
      values.push(priority);
    }
    if (status) {
      fieldsToUpdate.push(`status = $${fieldsToUpdate.length + 1}`);
      values.push(status);
    }
    if (deadline) {
      fieldsToUpdate.push(`deadline = $${fieldsToUpdate.length + 1}`);
      values.push(deadline);
    }
    if (assigned_to) {
      fieldsToUpdate.push(`assigned_to = $${fieldsToUpdate.length + 1}`);
      values.push(assigned_to);
    }

    // Adăugăm ID-ul task-ului în lista de valori
    values.push(id);

    // Construim interogarea SQL
    const updateQuery = `
      UPDATE tasks
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = $${values.length}
    `;

    await pool.query(updateQuery, values);

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});


// MESSAGES
app.get('/messages/:taskId', async (req, res) => {
  const { taskId } = req.params;
    try {
    const messages = await pool.query(
      `SELECT m.id, m.message, m.status, m.created_at, m.task_id, m.sender_id, u.name AS sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.task_id = $1 
       ORDER BY m.created_at ASC`, 
      [taskId]
    );
    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { task_id, sender_id, message } = req.body;

  console.log(task_id, sender_id, message);

  if (!task_id || !sender_id || !message) {
    return res.status(400).json({ success: false, message: 'Invalid request. All fields are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (task_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *',
      [task_id, sender_id, message]
    );

    res.status(201).json({ success: true, newMessage: result.rows[0] });
  } catch (error) {
    console.error('Error saving message to database:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
