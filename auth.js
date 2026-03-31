const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
app.use(express.json())

const secretKey = 'your_secret_key';

const users = []

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });

    res.json({ message: 'User created successfully' });
});

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foudUser = users.find(u => u.username === username && u.password === password);

    if (!foudUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
    } else {
        const token = jwt.sign({ username: foudUser.username }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    }
});

app.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    let decoded;

    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const user = users.find(u => u.username === decoded.username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    } else {

        return res.json({
            username: user.username,
            password: user.password,
            message: 'User authenticated successfully'
        });
    }
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});