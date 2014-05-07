var express = require('express');
var router = express.Router();

// ----- Page Templates -----
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Arteest' 
    });
});

// ----- API -----
router.post('/addasdf', function(req, res) {
    var db = req.db;

    var userName = req.body.username;
    var userEmail = req.body.useremail;

    var collection = db.get('usercollection');

    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function(err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;