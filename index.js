const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post("/post", (req,res) =>{
    res.send("post endpoint is working")
})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})