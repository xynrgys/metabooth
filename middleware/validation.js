const {log} = require("debug");
const {body, validationResult} = require('express-validator');


const checkUsername = (username) => {
    /*
    * REGEX CHECKER
    * ^ --- start of the string
    * \D --- anything not a digit [^0-9]
    * \w --- anything that is an alphanumerical character [a-zA-Z0-9]
    * {2,0} two more more characters with no upper limit
    */
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
}

const checkPassword = (password) => {
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
    return passwordChecker.test(password);
}

const checkEmail = (email) => {
    return email.isEmail();
}


const registerValidation = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    if (!checkUsername(username)) {
        req.flash("error", "invalid username");
        req.session.save(err => {
            res.redirect("/registration");
        })
    } else {
        console.log(typeof req.next);
        next();
    }
    if (!checkPassword(password)) {
        req.flash("error", "invalid password")
        req.session.save(err => {
            res.redirect("/registration");
        })
    } else {
        console.log(typeof req.next);
        next();
    }
    if (!checkEmail(email)) {
        req.flash("error", "invalid email")
        req.session.save(err => {
            res.redirect("/registration");
        })
    } else {
        console.log(typeof req.next);
        next();
    }
}

const validateStrongPassword = body("password")
    .isString()
    .isLength({min: 8})
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha();

const loginValidation = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.username;

    if (!checkUsername(username)) {
        req.flash("error", "invalid username");
        req.session.save(err => {
            res.redirect("/login")
        })
    } else {
        console.log(typeof req.next);
        next();
    }
    if (!checkPassword(password)) {
        req.flash("error", "invalid password");
        req.session.save(err => {
            res.redirect("/login");
        })
    } else {
        console.log(typeof req.next);
        next();
    }
}

module.exports = {registerValidation, loginValidation}
