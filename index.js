var express    = require("express");
var login = require('./routes/loginroutes');
var profile = require('./routes/profile');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

router.post('/register',login.register);
router.post('/login',login.login)
router.post('/edit-profile',profile.editProfile);
app.use('/api', router);

// app.get('/',function(req,res){
//     res.sendFile(__dirname + "/index.html");
// });


app.listen(5000);


