const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const FILE = './data.json';

/* ================= HOME ================= */
app.get("/", (req, res) => {
    res.send(`
        <html>
            <body style="background-color: lightblue; text-align: center; padding-top: 50px;">
                <h1>Working ✅</h1>
            </body>
        </html>
    `);
});

/* ================= GET ALL ================= */
app.get("/todos", (req, res) => {
    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        const todos = JSON.parse(data || "[]");
        res.json(todos);
    });
});

/* ================= POST ================= */
app.post("/todos", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send("Title is required");
    }

    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");

        const todos = JSON.parse(data || "[]");

        const newId =
            todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

        const newTodo = {
            id: newId,
            title,
            completed: false
        };

        todos.push(newTodo);

        fs.writeFile(FILE, JSON.stringify(todos, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing file");
            res.status(201).json(newTodo);
        });
    });
});

/* ================= PUT ================= */
app.put('/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;

    if (!title || typeof completed !== "boolean") {
        return res.status(400).send("Invalid data");
    }

    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");

        const todos = JSON.parse(data || "[]");

        const index = todos.findIndex(todo => todo.id === id);
        if (index === -1) {
            return res.status(404).send("Todo not found");
        }

        // Replace full object
        todos[index] = {
            id,
            title,
            completed
        };

        fs.writeFile(FILE, JSON.stringify(todos, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing file");
            res.json(todos[index]);
        });
    });
});

/* ================= PATCH ================= */
app.patch('/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;

    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");

        const todos = JSON.parse(data || "[]");

        const index = todos.findIndex(todo => todo.id === id);
        if (index === -1) {
            return res.status(404).send("Todo not found");
        }

        if (title !== undefined) {
            todos[index].title = title;
        }

        if (completed !== undefined) {
            todos[index].completed = completed;
        }

        fs.writeFile(FILE, JSON.stringify(todos, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing file");
            res.json(todos[index]);
        });
    });
});

/* ================= DELETE ================= */
app.delete('/todos/:id', (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file");

        const todos = JSON.parse(data || "[]");

        const updatedTodos = todos.filter(todo => todo.id !== id);

        if (todos.length === updatedTodos.length) {
            return res.status(404).send("Todo not found");
        }

        fs.writeFile(FILE, JSON.stringify(updatedTodos, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing file");
            res.send("Todo deleted successfully");
        });
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});