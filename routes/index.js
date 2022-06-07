var express = require('express');
var router = express.Router();
var isLoggedin = require('../middleware/routeprotectors').userIsLoggedIn;
const {getNRecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');
var db = require("../config/database");

router.get('/', getNRecentPosts, function (req, res, next) {
    res.render('index', {title: "Truman's Page"});
});

router.get('/login', (req, res, next) => {
    res.render("login", {title: "Login"});
});

router.get('/register', (req, res, next) => {
    res.render("registration", {title: "Registration"});
});

router.get('/postImage', isLoggedin, (req, res, next) => {
    res.render("postImage", {title: "Post Image"});
});

//post/id
router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
    req.session.postId=req.params.id;
    res.render("ImagePosts", { title: `Post ${req.params.id}`, post:res.locals.currentPost});
});

module.exports = router;
