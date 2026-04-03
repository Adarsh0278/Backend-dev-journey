// const e = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5500',
}));


const secretKey = '897328hwkdh8';

const users = [];




function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

app.post('/signup', (req, res) => {
    const {username,password} = req.body;
    users.push({username,password})
    res.json({ message: 'User created successfully' });
    console.log(users);

});

app.post('/signin', (req, res) => {
    const {username,password} = req.body;
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (!foundUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
    } else {
        const token = jwt.sign({ username: foundUser.username }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    }

});

app.get('/todos',auth, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
    res.sendFile(__dirname + '/plubic/me.html');
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});
