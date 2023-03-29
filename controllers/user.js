const User = require('../models/user');
var crypto = require('crypto');
const JsonWebToken = require("jsonwebtoken")
const Bcrypt = require("bcryptjs")
require('dotenv').config()

exports.getUsers = (req, res, next) => {
    // return array of existing users
    User.find().then(foundUsers => {
        res.json({
            message: "All users",
            users: foundUsers
        });
    });
}

exports.getUser = (req, res, next) => {
    // return array of existing users
    User.findOne({account_number: req.params.id}).then(foundUser => {
        res.json({
            message: "User",
            user: foundUser
        });
    });
}

exports.createUser = (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const age = req.body.age;
    const balance = req.body.balance;
    const password = req.body.password;
    const is_admin = req.body.is_admin;

    const account_number = Math.floor(1000000000 + Math.random() * 9000000000);

    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';      
    for (let i = 1; i <= 14; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
            
        pass += str.charAt(char)
    }
    const hash = Bcrypt.hashSync(pass)
        
    // create a new User instance
    const user = new User({
        first_name: first_name,
        last_name: last_name,
        age: age,
        balance: balance,
        account_number: account_number,
        password: hash,
        is_admin: is_admin,

    });

    // save the instance to the database
    user.save()
    .then(userSaved => {
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                first_name: first_name,
                last_name: last_name,
                age: age,
                balance: balance,
                account_number: account_number,
                is_admin: is_admin,
            },
            password: pass
        });
    })
    .catch(err => console.log('err', err));
}

exports.updateUser = (req, res, next) => {    
    const userSaved = User.findOneAndUpdate({account_number: req.params.id}, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        balance: req.body.balance,
        account_number: req.body.account_number,
        connections: req.body.connections
    },{new: true})
    .then(userSaved => {
        res.status(200).json({
            message: 'User updated successfully!',
            user: {
                first_name: userSaved.first_name,
                last_name: userSaved.last_name,
                age: userSaved.age,
                balance: userSaved.balance,
                account_number: userSaved.account_number,
                connections: userSaved.connections
            }
        });
    })   
    .catch(err => console.log('err', err));
}

exports.deleteUser = (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
    .then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((error) => {
        res.status(500).send(error);
    })
}

exports.login = (req, res, next) => {
    if(!req.body.account_number || !req.body.password) {
        res.json({success: false, error: "Account number & password are required"})
        return
    }
    User.findOne({account_number: req.body.account_number})
        .then((user) => {
            if(!user) {
                res.json({success: false, error: "User not found"})
            } else {
                if(!Bcrypt.compareSync(req.body.password, user.password)) {
                    res.json({success: false, error: "Incorrect password"})
                } else {
                    const token = JsonWebToken.sign({ id: user._id, account_number: user.account_number}, process.env.SECRET, { expiresIn: '900s' })
                    res.json({success: true, token: token, user: user})
                    // res.render('home', {
                    //     user: user
                    // });
                }
            }
        })
}
