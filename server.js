const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const md5 = require('md5');

const Schema = new mongoose.Schema({
    id: String,
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    projects: [
        {
            project_id: String,
            project_name: String,
            todos: [
                {
                    todo_id: {type: String, required: true},
                    todo_name: {type: String, required: true},
                    todo_deadline: { type: Date, default: Date.now },
                    todo_done: { type: String, default: false },
                    todo_priority: { type: Number, default: 0 }
                }
            ]
        }
    ]
});

const User = mongoose.model('User', Schema);

const DB_URL = 'mongodb://todo-admin:todo-password@ds021016.mlab.com:21016/rubygarage-todo';

mongoose.connect(DB_URL, function (error) {
    if (error) console.error(error);
});

handleError = (err, res) => {
    res.status(400).json({
        message: err.message
    });
};

express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .get('/api', (req, res) => {
        res.status(200).json({msg: 'OK'})
    })

    .post('/api/users', (req, res) => {
        const { name, password } = req.body;
        let user = new User({
            name,
            password
        });
        user.id = user._id;
        user.save((err) => {
            if (!err) {
                res.status(201).json(user)
            } else handleError(err, res);
        });
    })

    .put('/api/users/login', (req, res) => {
        const { name, password } = req.body;
        User.find({name, password}, (err, users) => {
            if (!err) {
                if (users.length === 0) {
                    handleError({message: "No such user found"}, res)
                } else {
                    let user = users[0];
                    const {id, name} = user;
                    let showUser = { id, name };
                    res.status(200).json(showUser);
                }
            } else handleError(err, res);
        });
    })



    /* .get('/api/todos', function (req, res) {
     Data.find( function ( err, todos ) {
     res.status(200).json(todos);
     });
     })

     .post('/api/todos', function (req, res) {
     var todo = new Data( req.body );
     todo.id = todo._id;
     todo.save(function (err) {
     res.status(200).json(todo);
     });
     })

     .delete('/api/todos', function (req, res) {
     Data.remove({ completed: true }, function ( err ) {
     res.status(200).json({msg: 'OK'});
     });
     })

     .get('/api/todos/:id', function (req, res) {
     Data.findById( req.params.id, function ( err, todo ) {
     res.status(200).json(todo);
     });
     })

     .put('/api/todos/:id', function (req, res) {
     Data.findById( req.params.id, function ( err, todo ) {
     todo.title = req.body.title;
     todo.completed = req.body.completed;
     todo.save( function ( err, todo ){
     res.status(200).json(todo);
     });
     });
     })

     .delete('/api/todos/:id', function (req, res) {
     Data.findById( req.params.id, function ( err, todo ) {
     todo.remove( function ( err, todo ){
     res.status(200).json({msg: 'OK'});
     });
     });
     }) */

    .use(express.static(__dirname + '/public'))
    .listen(process.env.PORT || 5000);
