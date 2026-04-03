const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://adarshkrpandit:hmBqWeoaLMELrwkM@cluster0.ncjgdw.mongodb.net/todo-app?retryWrites=true&w=majority")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String
});

const Todo = new Schema({
  userId: ObjectId,
  name: String,
  title: String,
  description: String,
  completed: Boolean
});

const UserModel = mongoose.model('User', User);
const TodoModel = mongoose.model('Todo', Todo);

module.exports = {
  UserModel,
  TodoModel
};