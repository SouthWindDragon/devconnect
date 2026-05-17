
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = 'senac_secret';

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('devconnect.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        location TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        platform TEXT
    )`);

    db.get("SELECT COUNT(*) as count FROM jobs", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT INTO jobs (title, company, location) VALUES ('Desenvolvedor Front-End', 'Tech Solutions', 'São Paulo')");
            db.run("INSERT INTO jobs (title, company, location) VALUES ('Estágio em TI', 'InovaDev', 'Remoto')");
        }
    });

    db.get("SELECT COUNT(*) as count FROM courses", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT INTO courses (title, platform) VALUES ('JavaScript Moderno', 'Udemy')");
            db.run("INSERT INTO courses (title, platform) VALUES ('React do Zero', 'Alura')");
        }
    });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
            if (err) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            res.json({ message: 'Usuário cadastrado com sucesso' });
        }
    );
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        const token = jwt.sign({ id: user.id }, SECRET);

        res.json({ token, name: user.name });
    });
});

app.get('/jobs', (req, res) => {
    db.all('SELECT * FROM jobs', [], (err, rows) => {
        res.json(rows);
    });
});

app.get('/courses', (req, res) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
