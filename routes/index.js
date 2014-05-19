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
        error: 'false',
        data: null
    });
});

router.get('/draw/:id', function(req, res) {
    var canvasesCollection = req.db.get('canvases');

    canvasesCollection.findOne({_id: req.params.id}, function(err, doc) {
        var error = null;

        if(err) {
            error = 'We could not load your artwork at this time.';
        } else {
            if(doc) {
                error = null;
            } else {
                error = 'We could not load your artwork at this time.';
            }
        }

        res.render('draw', {
            id: 'draw',
            title: 'Arteest | Draw',
            error: error,
            data: doc
        });
    });
});

router.get('/gallery', function(req, res) {
    var canvasesCollection = req.db.get('canvases');

    canvasesCollection.find({}, function(err, doc) {
        var error = null;
        var canvases = null;

        if(err) {
            error = 'We could not load the gallery at this time.';
        } else {
            if(doc) {
                error = null;

                canvases = _.groupBy(doc, 'name');
            } else {
                error = 'We could not load the gallery at this time.';
            }
        }

        res.render('gallery', {
            id: 'gallery',
            title: 'Arteest | Gallery',
            canvasesByName: canvases
        });
    });
});

// ----- API -----
router.post('/save', function(req, res) {
    var canvasesCollection = req.db.get('canvases');

    var name = req.body.name;
    var strokes = req.body.strokes;

    canvasesCollection.insert({name: name, strokes: strokes}, function(err, doc) {
        if(err) {
            res.send({
                error: 'We could not save your artwork at this time: ' + err
            });
        } else {
            res.send({
                success: true,
                link: 'Your artwork has been saved! <a href="/draw/' + doc._id + '">View</a>'
            });
        }
    });
});

module.exports = router;