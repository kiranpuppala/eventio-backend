var express = require("express");
var login = require('./routes/loginroutes');
var profile = require('./routes/profile');
var events = require('./routes/events');
var responses = require('./utils/responses');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var config = require('./config');

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
        if (err.name == "TokenExpiredError") {
          res.send(responses.errorUnauth);
        } else {
          res.send(responses.errorUnauth);
        }
      } else {
        next();
      }
    });
  } else {
    res.send(responses.errorUnauth);
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
router.post('/validate-token', verifyToken, function (req, res) {
  res.send({
    code: 200,
    status: "TokenValid",
    response: {}
  });
});
router.post('/list-events', verifyToken, events.listEvents);


app.use('/api', router);


app.listen(5000);

