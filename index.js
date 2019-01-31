var express    = require("express");
var login = require('./routes/loginroutes');
var profile = require('./routes/profile');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var config = require('./config');
var app = express();
app.use(bodyParser.urlencoded({ limit : '50mb' ,extended: true }));
app.use(bodyParser.json({limit : '50mb', extended : true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

function verifyToken(req, res, next){
    
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        jwt.verify(req.headers['Authorization'], config.secretKey , (err, authData)=>{
            if(err){
                console.log("AUTHDATA",authData)
                res.send({
                  code : 403, 
                  status : "Authorization failed", 
                  response : {}
                });
            }else{
                next();
            }});

    } else{
      res.send({
        code : 403, 
        status : "Authorization failed", 
        response : {}
      });
    }
  }

router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

router.post('/register',login.register);
router.post('/login',login.login)
router.post('/edit-profile',verifyToken,profile.editProfile);
router.post('/get-profile',verifyToken,profile.getProfile);
app.use('/api', router);


app.listen(5000);


