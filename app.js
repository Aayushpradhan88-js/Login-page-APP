const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const path = require('path');
const userModel = require('./Models/Home');
const bcrypt = require('bcrypt');
const { hash } = require('crypto');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render("Home");
})

//signup
app.post('/signup', (req, res) => {
    let { Email, Password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Password, salt, async (err, hash) => {

            let user = await userModel.create({
                Email,
                Password: hash
            })

            let encryption = jwt.sign({Email: 'Email'}, 'eeecne');
            res.cookie('encryption', encryption);
            res.send(user);
        })
    })

})
// This how we can signin to an particular application

//signout or logout 
app.get('/logout', (req, res) => {
    //Note: to remove the cookie from the browser we can use the variablename and an empty colon ""
    res.cookie("encryption", ""); //this is the code
    res.redirect('/');
})
//This is how we can logout form the particular application

//Login -- again login to the same app using email and password
app.get('/login', (req, res) => {
    res.render("userlogin");
})

app.post('/login', async (req,res) => {
    let user = await userModel.findOne({email: req.body.email});
    if(!user) res.send("Welcome Back!!");
    // else res.send("Something went wrong !!!");
    // console.log('user', user);

    bcrypt.compare(req.body.Password, user.Password, (err, result) => {
        // if(result) console.log('encrypted');

        console.log(result);
        // else console.log('Try again');
    })
})

let port = app.listen(3000);
console.log(`App is running on port ${port}`);