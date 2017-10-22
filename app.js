var express = require('express'),
app = express(),
bodyParser = require("body-parser"),
mongoose    = require("mongoose"),
methodOverride = require("method-override"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
User = require("./models/user"),
routes = require("./routes/router");

mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//this should after passport configuration
app.use("/", routes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
})