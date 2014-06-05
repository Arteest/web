var express = require('express');
var router = express.Router();

// ----- Page Templates -----
router.get('/', function(req, res) {
    res.render('index', {
        id: 'index',
        title: 'Index'
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
                        canvases: canvases.reverse()
                    });                        
                } 
            }
        });
    }

    collateCanvasLinkedList(req.params.id);
});

router.get('/gallery', function(req, res) {
    var canvasesCollection = req.db.get('canvases');
    var docloops = 0;
    var ptychloops = 0;
    // Get all canvases
    canvasesCollection.find({}, function(err, doc) {
        if(doc) {
            var docs = _.sortBy(doc, '_id');
            var canvases = [];

            // Loop through every node in the collection
            while(docs.length) {
                docloops++;
                var polyptych = [];

                var canvas = docs.pop(); // Pop a node to traverse towards the root
                polyptych.push(canvas);

                // Loop through each document looking for parents in the tree
                var iter = canvas;
                while(typeof iter !== "undefined") {
                    ptychloops++;
                    iter = _.find(docs, function(element){return element._id == iter.prev});

                    if(typeof iter !== "undefined") {
                        polyptych.push(iter);
                    }
                }

                canvases.push(polyptych.reverse());
            }

            console.log(docloops);
            console.log(ptychloops);

            res.render('gallery', {
                id: 'gallery',
                title: 'Arteest | Gallery',
                canvases: canvases
            });
        }
    });
});

// ----- API -----
router.post('/save', function(req, res) {
    var canvasesCollection = req.db.get('canvases');

    var name = req.body.name;
    var width = req.body.width;
    var height = req.body.height;
    var strokes = req.body.strokes;
    var prev = req.body.prev;

    canvasesCollection.insert({
        name: name, 
        width:width, 
        height:height, 
        strokes: strokes, 
        prev: prev
    }, function(err, doc) {
        if(err) {
            res.send({
                error: 'We could not save your artwork at this time: ' + err
            });
        } else {
            res.send({
                success: true,
                link: 'Your canvas has been saved!'
            });
        }
    });
});

module.exports = router;