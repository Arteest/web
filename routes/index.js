var express = require('express');
var router = express.Router();

// ----- Page Templates -----
router.get('/', function(req, res) {
    res.render('index', {
        id: 'index',
        title: 'Arteest'
    });
});

router.get('/draw', function(req, res) {
    res.render('draw', {
        id: 'draw',
        title: 'Arteest | Draw',
        canvases: []
    });
});

router.get('/draw/:id', function(req, res) {
    var canvasesCollection = req.db.get('canvases');
    var canvases = [];

    function collateCanvasLinkedList(id) {
        canvasesCollection.findOne({_id: id}, function(err, doc) {
            if(doc) {
                canvases.push(doc);

                if(doc.prev) {
                    collateCanvasLinkedList(doc.prev);
                } else {
                    res.render('draw', {
                        id: 'draw',
                        title: 'Arteest | Draw',
                        canvases: canvases.reverse(),
                        success: req.query.alert ? 'Your artwork has been saved and sent!' : null
                    });                        
                } 
            } else {
                // Render blank or up to the possibly deleted node
                res.render('draw', {
                    id: 'draw',
                    title: 'Arteest | Draw',
                    canvases: canvases.reverse()
                });
            }
        });
    }

    collateCanvasLinkedList(req.params.id);
});

router.get('/gallery', function(req, res) {
    var canvasesCollection = req.db.get('canvases');

    // Get all canvases
    canvasesCollection.find({}, function(err, doc) {
        if(doc) {
            var docs = _.sortBy(doc, '_id');
            var canvases = [];

            // Loop through every node in the collection
            while(docs.length) {
                var polyptych = [];

                var canvas = docs.pop(); // Pop a node to traverse towards the root
                polyptych.push(canvas);

                // Loop through each document looking for parents in the tree
                var iter = canvas;
                while(typeof iter !== "undefined") {
                    iter = _.find(docs, function(element){return element._id == iter.prev});

                    if(typeof iter !== "undefined") {
                        polyptych.push(iter);
                    }
                }

                canvases.push(polyptych.reverse());
            }

            res.render('gallery', {
                id: 'gallery',
                title: 'Arteest | Gallery',
                canvases: canvases
            });
        }
    });
});

// ----- API -----
router.post('/save', function(req, res, next) {
    var canvasesCollection = req.db.get('canvases');

    var name = req.body.name;
    var email = req.body.email;
    var width = req.body.width;
    var height = req.body.height;
    var strokes = req.body.strokes;
    var prev = req.body.prev;

    // Validate strokes
    if(!strokes) {
        res.send({
            error: 'You cannot submit a blank drawing.'
        });
        
        return next();
    }

    // Validate all email addresses
    if(!!email) {  
        var validator = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        email = email.replace(/\s/g, ''); // Remove all white space
        email = email.split(','); // Splits all emails
        
        for(var i = 0; i < email.length; i++) {
            if(!validator.test(email[i])) {
                res.send({
                    error: 'Please enter a valid email address.'
                });

                return next();
            }
        }
    }

    // Insert drawing
    var promise = canvasesCollection.insert({
        name: name, 
        width:width, 
        height:height, 
        strokes: strokes, 
        prev: prev
    });

    // Error inserting drawing
    promise.error(function(err) {
        res.send({
            error: 'We could not save your artwork at this time: ' + err
        });

        return next();
    });

    // Success - Email all recipients
    promise.success(function(doc) {     
        if(!!email) {
            var options = {
                from: "Arte of Arteest <draw@arteest.me>",
                bcc: email,
                subject: "A Wild Drawing Appears",
                text: "Bonjour, " + (name ? "@"+name : "An Arteest") + " would like you to complete a drawing. Simply follow this link to get started: http://www.arteest.me/draw/" + doc._id + ". À Bientôt!",
                html: "<p>Bonjour,<br /><br /></p><p>" + (name ? "@"+name : "An Arteest") + " would like you to complete a drawing.<br /><br />Simply click the following link to get started: <a href='http://www.arteest.me/draw/" + doc._id + "'>http://www.arteest.me/draw/" + doc._id + "</a><br /><br /></p><p>À Bientôt!<br />Arte of Arteest</p>"
            }

            // 1 upgrade to latest nodemailer 1.0
            // 2 upgrade all code here to new nodemailer
            // 3 make it so you send to someone, not bcc
            // 4 make that a function that is fired off and immediately return artwork save (who cares if it didn't send the email right)

            req.smtp.sendMail(options, function(err) {
                if(err) {
                    res.send({
                        error: 'Your artwork has been saved but we could not send it to your friend(s) at this time. ' + err
                    });
                } else {
                    res.send({
                        redirect: '/draw/' + doc._id + '?alert=success'
                    });
                }
            });
        } else {
            res.send({
                redirect: '/draw/' + doc._id + '?alert=success'
            });
        }
    });
});

module.exports = router;