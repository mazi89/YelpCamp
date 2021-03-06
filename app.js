//DEPENDENCIES ========================================
const express 		= require('express'),
	  app 			= express(),
	  bodyparser 	= require('body-parser'),
	  mongoose 		= require('mongoose'),
	  flash			= require('connect-flash'),
	  passport		= require("passport"),
	  LocalStrategy	= require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground 	= require('./models/campground'),
	  seedDB 		= require('./seeds'),
	  Comment		= require("./models/comment"),
	  User			= require("./models/user");

//ROUTES ==============================================
const commentRoutes 	= require("./routes/comments"),
	  campgroundRoutes 	= require("./routes/campgrounds"),
	  indexRoutes 		= require("./routes/index");

// seedDB(); //seed the database
//Network
app.set('port', process.env.PORT || 8080);
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp" ;

mongoose.connect(url, {useNewUrlParser: true});
console.log(process.env.DATABASEURL);

app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


///PASSPORT CONFIGURATION
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

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

app.listen(app.get('port'), process.env.IP , () => {
	console.log('YelpCamp server is up.');
});