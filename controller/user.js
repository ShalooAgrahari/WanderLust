const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.userSignUp = (async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            };
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    };   
});

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.userLogin = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let Redirect = res.locals.redirectUrl || "/listings";
    res.redirect(Redirect);
};

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
};