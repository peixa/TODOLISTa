let mongoose = require('./db');

let todos =new mongoose.Schema({
    text: String,
    status: String,
    time: String
})

let todosModel = mongoose.model('Todos', todos, 'TodosList');
module.exports = { todosModel };