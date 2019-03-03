var express = require("express");
var login = require('./routes/loginroutes');
var profile = require('./routes/profile');
var events = require('./routes/events');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var config = require('./config');

const crypto = require('crypto');
var https = require('https');
const fs = require("fs");

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();
var credentials = { key: privateKey, cert: certificate };


// var credentials = crypto.createCredentials({key: privateKey, cert: certificate});



var app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var router = express.Router();

function verifyToken(req, res, next) {

  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    jwt.verify(req.headers['authorization'], config.secretKey, (err, authData) => {
      if (err) {
        console.log("AUTHDATA", authData, err)
        if (err.name == "TokenExpiredError") {
          res.send({
            code: 401,
            status: "Unauthorized",
            response: {}
          });
        } else {
          res.send({
            code: 403,
            status: "Authorization failed",
            response: {}
          });
        }
      } else {
        next();
      }
    });

  } else {
    res.send({
      code: 403,
      status: "Authorization failed",
      response: {}
    });
  }
}

router.get('/', function (req, res) {
  res.json({ message: 'welcome to our upload module apis' });
});

router.post('/register', login.register);
router.post('/login', login.login)
router.post('/edit-profile', verifyToken, profile.editProfile);
router.get('/get-profile', verifyToken, profile.getProfile);
router.post('/create-event', verifyToken, events.createEvent);
router.post('/update-event', verifyToken, events.updateEvent);
router.post('/join-event', verifyToken, events.joinEvent);
router.post('/validate-token', verifyToken, function(req,res){
  res.send({
    code : 200, 
    status : "TokenValid", 
    response : {}
  });
});
router.post('/list-events', verifyToken, events.listEvents);


app.use('/api', router);

app.get('/test', function (req, res) {
  res.sendFile('/server.html', { root: __dirname })
});

app.get('/.well-known/assetlinks.json', function (req, res) {
  res.sendFile('/assetlinks.json', { root: __dirname })
});

// server.setSecure(credentials);

app.listen(5000);

// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(5000);
