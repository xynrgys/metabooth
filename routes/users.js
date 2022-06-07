var express = require('express');
var router = express.Router();
var UserError = require('../helpers/error/UserError');
const {successPrint, errorPrint} = require('../helpers/debug/debugprinters');
const db = require('../config/database');
var bcrypt = require("bcrypt");
const {hash} = require("bcrypt");
const {registerValidation, loginValidation} = require("../middleware/validation");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//router.use(registerValidation)
router.post('/registration', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {
        db.execute("Select * from users where username=?", [username])
            .then(([results, fields]) => {
                if (results && results.length == 0) {
                    return db.execute("Select * from users where email=?", [email]);
                } else {
                    throw new UserError(
                        "Registration failed, username exists",
                        "/registration",
                        200
                    );
                }
            })
            .then(([results, fields]) => {
                if (results && results.length == 0) {
                    return bcrypt.hash(password, 15);
                } else {
                    throw new UserError(
                        "Registration failed, email exists",
                        "/registration",
                        200
                    );
                }
            })
            .then((hashedPassword) => {
                let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now())"
                return db.execute(baseSQL, [username, email, hashedPassword])
            })
            .then(([results, fields]) => {
                if (results && results.affectedRows) {
                    successPrint("User was created.");
                    req.flash('success', 'User account has been made.');
                    res.redirect('/login');
                } else {
                    throw new UserError(
                        "Server error, could not be created.",
                        "/registration",
                        500
                    );
                }
            })
            .catch((err) => {
                errorPrint("user could not be made", err);
                if (err instanceof UserError) {
                    errorPrint(err.getMessage());
                    req.flash('error', err.getMessage());
                    res.status(err.getStatus());
                    res.redirect(err.getRedirectURL());
                } else {
                    next(err);
                }
            });
    } else {
        req.flash('error', 'Passwords are not the same.');
    }
});


//router.use(loginValidation)
router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
    let userId;
    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                userId = results[0].id;
                //res.cookie("logged", username, {expires: new Date(Date.now() + 900000), httpOnly: true});
                //res.cookie("isLogged", true, {expires: new Date(Date.now() + 900000), httpOnly: false});
                //res.redirect("/");
                return bcrypt.compare(password, hashedPassword);
            } else {
                throw new UserError("Invalid username and/or password.");
            }
        })
        .then((passwordMatched) => {
            if (passwordMatched) {
                successPrint(`User ${username} is logged in`)
                req.flash('success', 'User account has been logged in.');
                req.session.username = username;
                req.session.userId = userId;
                res.locals.logged = true;
                res.redirect('/');
            } else {
                throw new UserError("Invalid username and/or password.");
            }
        })
        .catch((err) => {
            errorPrint("user login failed");
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }
        })
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint('Session could not be destroyed.');
            next(err);
        } else {
            successPrint('Session was successfully destroyed.')
            res.clearCookie('csid');
            res.json({status: "OK", message: "user is logged out"});
        }
    })
});

module.exports = router;
