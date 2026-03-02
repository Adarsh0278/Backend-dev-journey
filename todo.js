const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("working");
});


app.get("/allTodo", (req, res) => {
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const parsedData = JSON.parse(data)

        res.send(parsedData)
    })
})

app.post("/post", (req, res) => {
    const newTodo = req.body;

    if (!newTodo || !newTodo.title) {
        return res.status(400).send("Invalid data");
    }

    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading");

        const todos = JSON.parse(data);

        const newId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

        const todoToAdd = {
            id: newId,
            title: newTodo.title,
            completed: false
        };

        todos.push(todoToAdd);

        fs.writeFile('./data.json', JSON.stringify(todos, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing");

            res.json(todoToAdd);
        });
    });
});


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});