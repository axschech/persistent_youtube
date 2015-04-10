var express = require('express'),
    bodyParser = require ('body-parser'),
    mongoose = require('mongoose'),
    Models = {},
    app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  var code = req.query.code;
  console.log(code);
  Models.User.find({
    code: code
  }, function (data) {
    if (data === null) {
        res.send([]);
    }
  });
});
app.post('/', function (req, res) {
    console.log(req.body);
    if(req.body.auth) {
        var user = new Models.User({auth: req.body.auth});
        console.log(user.auth);
        user.save(function (err, user) {
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
        auth: Object
    });
    Models.User = mongoose.model('User', userSchema);
};