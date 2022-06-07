var express = require('express');
var router = express.Router();
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const { create } = require('../models/comments');

router.post('/create', (req, res, next) => {
    let postId = req.session.postId;

    if (!req.session.username) {
        req.flash('error', 'Comment could not be made. Must be logged in to comment');
        res.redirect('/post/' + postId);
    } else {

        let {comment} = req.body;
        let postId = req.session.postId;
        let username = req.session.username;
        let userId = req.session.userId;

        create(userId, postId, comment)
            .then((wasSuccessful) => {
                if (wasSuccessful !== -1) {
                    successPrint(`Comment was created for ${username}`);
                } else {
                    errorPrint('Comment was not saved');
                    res.json({
                        code:-1,
                        status:"danger",
                        message:"comment was not created"
                    })
                }
                res.redirect('/post/' + postId);
            }).catch((err) => next(err));
    }
})

module.exports = router;
