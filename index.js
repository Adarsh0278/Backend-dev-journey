const express = require('express')
const app = express()

let todo = [2, 3]

app.get('/', (req, res) => {
  res.json(todo)
})

app.post('/post', (req, res) => {
  let a = 4
  todo.push(a)
  res.json(todo)
})

app.delete('/delete', (req, res) => {
  console.log("DELETE route hit")
  todo.splice(1,1)
  res.json(todo)
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})