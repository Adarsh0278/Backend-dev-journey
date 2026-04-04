const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { UserModel, TodoModel } = require('./db');
const bycrypt = require('bcrypt');
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5500',
}));

const secretKey = 'your_secret_key';
const saltRounds = 10;

function auth(req, res, next) {
    const token = req.token || req.headers['authorization'];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
    } 

    try{
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;
        next();     
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}


app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 6);
    try {

        const user = new UserModel({ name, email, password:hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(400).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
});


app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bycrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({
            message: 'Error signing in',
            error: error.message
        });
    }
});


app.post('/todos', auth, async (req, res) => {
    const { title, description } = req.body;

    try {
        const todo = new TodoModel({ 
            userId: req.userId,
            name: req.body.name,
            title, 
            description,
            completed: false
        });

        await todo.save();

        res.status(201).json({ 
            message: 'Todo created successfully',
            todo 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating todo' });
    }
});

app.get('/todos', auth, async (req, res) => {
    try {
        const todos = await TodoModel.find({ userId: req.userId });
        res.json(todos);

    } catch (error) {
        res.status(500).json({ message: "Error fetching todos" });
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});