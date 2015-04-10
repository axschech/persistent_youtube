var express = require('express'),
    bodyParser = require ('body-parser'),
    mongoose = require('mongoose'),
    Models = {},
    app = express();
mongoose.set('debug', true);
app.use(bodyParser.json());

app.get('/', function (req, res) {
  var code = req.query.code;
  console.log(code);
  Models.User.find({
    'info.email': code
  },
   function (err, data) {
    if (data === null) {
        res.send([]);
    } else {
        res.send(data);
    }
  });
});
app.post('/', function (req, res) {
    console.log(req.body);
    if(req.body.auth && req.body.info) {
        var user = {auth: req.body.auth, info: req.body.info};
        var query = {"info.email": req.body.info.email};

        Models.User.findOneAndUpdate(query, user, {upsert: true}, function(err, user){
            console.log(err);
            console.log(user);
        });
        res.send([]);
    }
});
var server = app.listen(3000, function () {
    mongoose.connect('mongodb://localhost/node');
    var db = mongoose.connection;
    db.once('open', function (callback) {
       createUserSchema();
    });
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var createUserSchema = function () {
    var userSchema = mongoose.Schema({
        auth: Object,
        info: Object,
        _id: Number
    });
    Models.User = mongoose.model('User', userSchema);
};