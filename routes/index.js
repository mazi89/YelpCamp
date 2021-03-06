const 	express = require("express"),
	  	router = express.Router(),
	  	passport = require("passport"),
		User = require("../models/user");


router.get('/', (req, res) => {
	res.render('landing');
});

// ===========
// AUTH ROUTES
// ===========

//show register form
router.get("/register", (req, res) => {
	res.render("register");
});

//handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}	
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Succesfully registered! Welcome: ${user.username}`);
			console.log(user.username);
			res.redirect("/campgrounds");
		});
	});
});


// show login form
router.get("/login", (req, res) => {
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) , (req,res) => {
	
});

//logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;