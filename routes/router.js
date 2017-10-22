var express = require('express'),
router  = express.Router(),
House = require("../models/house"),
Member= require("../models/member"),
User = require("../models/user"),
housesRoot = '/houses',
membersRoot = "/members",
passport = require("passport"),
dbCallback = function(err, val) {
    if(err) {
        console.log(err);
        if(this.failureCallback){
            this.failureCallback(err);
        }
    } else {
        this.successCallback(val);
    }
},
isLoggedInMiddleware = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
//home page
router.get("/", function(req, res) {
    res.render("home");
});
//=============================================
//  House Routes
//=============================================
//show list of houses
router.get(housesRoot, function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("houses/index", {houses: val});
        }
    }; 
    House.find({}, dbCallback.bind(clbckContext));
});
//add a new house
router.get(housesRoot+"/new", isLoggedInMiddleware, function(req, res) {
    res.render("houses/new");
});
//save new house
router.post(housesRoot, isLoggedInMiddleware, function(req, res) {
    var addedHouse = req.body.house;
    var clbckContext = {
        successCallback: function() {
            res.redirect(housesRoot);
        }
    };
    House.create(addedHouse, dbCallback.bind(clbckContext));
});
//show a house
router.get(housesRoot+"/:id", function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("houses/show", {house: val});
        }
    };
    House.findById(req.params.id).populate('members').exec(dbCallback.bind(clbckContext));
});
//edit a house
router.get(housesRoot+"/:id/edit", isLoggedInMiddleware, function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("houses/edit", {house: val});
        }
    };
    House.findById(req.params.id, dbCallback.bind(clbckContext));
});
//update a house
router.put(housesRoot+"/:id", isLoggedInMiddleware, function(req, res) {
    var addedHouse = req.body.house;
    var clbckContext = {
        successCallback: function() {
            res.redirect(housesRoot+"/"+req.params.id);
        }
    };
    House.findByIdAndUpdate(req.params.id, addedHouse, dbCallback.bind(clbckContext));
});

//=============================================
//  Member Routes
//=============================================
//show list of members
router.get(membersRoot, function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("members/index", {members: val});
        }
    }; 
    Member.find({}, dbCallback.bind(clbckContext));
});
//add a new member
router.get(membersRoot+"/new", isLoggedInMiddleware, function(req, res) {
    res.render("members/new");
});
//save new member
router.post(membersRoot, isLoggedInMiddleware, function(req, res) {
    var addedmember = req.body.member;
    var clbckContext = {
        successCallback: function() {
            res.redirect(membersRoot);
        }
    };
    Member.create(addedmember, dbCallback.bind(clbckContext));
});
//show a member
router.get(membersRoot+"/:id", function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("members/show", {member: val});
        }
    };
    Member.findById(req.params.id, dbCallback.bind(clbckContext));
});
//edit a member
router.get(membersRoot+"/:id/edit", isLoggedInMiddleware, function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("members/edit", {member: val});
        }
    };
    Member.findById(req.params.id, dbCallback.bind(clbckContext));
});
//update a member
router.put(membersRoot+"/:id", isLoggedInMiddleware, function(req, res) {
    var addedmember = req.body.member;
    var clbckContext = {
        successCallback: function() {
            res.redirect(membersRoot+"/"+req.params.id);
        }
    };
    Member.findByIdAndUpdate(req.params.id, addedmember, dbCallback.bind(clbckContext));
});

//show list of members eligilble for association
router.get(housesRoot+"/:id/associate/members", isLoggedInMiddleware, function(req, res) {
    var clbckContext = {
        successCallback: function(val) {
            res.render("members/showList", {members: val, houseId: req.params.id});
        }
    };
    Member.find({}, dbCallback.bind(clbckContext));
});
//=============================================
//  Login/register Routes
//=============================================
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    var clbckContext = {
        successCallback: function() {
            passport.authenticate("local")(req, res, function(user){
            res.redirect("/");
        });
        }
    };
    User.register(newUser, req.body.password, dbCallback.bind(clbckContext));
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});
module.exports = router;