const user = require("../models/user"),
  passport = require("passport");
exports.register = async (req, res) => {
  user.register(req.body, (err, data) => {
    if (err) {
      console.log(err)
      const message = err.message;
      console.log(message)
      if (message.indexOf("ER_DUP_ENTRY") != -1) {
        if (message.indexOf("email") != -1)
          req.flash("error", "Email is Already Used");
        else {
          req.flash("Success", "Phone Number is Already Used")
        }
      }
      else {
        req.flash("error", "Something Went Wrong");
      }
      res.redirect("/register")
    }
    else {
      req.flash("success", "Registered Successfully")
      res.redirect("/login");
      /* passport.authenticate("local")(req, res, function () {
        req.flash("success", "Registered Successfully")
        res.redirect("/");
      }); */
    };
  });
};
exports.seller_register = async (req, res) => {
  user.seller_register(req.body, (err, data) => {
    if (err) {
      if (err == "Invalid secret key") {
        req.flash("error", err);
      }
      else {
        const message = err.message;
        if (message.indexOf("ER_DUP_ENTRY") != -1) {
          if (message.indexOf("email") != -1)
            req.flash("error", "Email is Already Used");
          else {
            req.flash("error", "Phone Number is Already Used")
          }
        }
        else {
          req.flash("error", "Something Went Wrong");
        }
      }
      res.redirect("/seller/register")
    }
    else {
      req.flash("success", "Registered Successfully")
      res.redirect("/login");
      /* passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Registered Successfully'
      }), function (req, res) {
        res.status(201).redirect("/")
      } */
    }
  });
};
exports.logout = async (req, res) => {
  req.flash("success", "Logged Out Successfully");
  req.logout();
  res.redirect("/");
};
exports.seller_registerform = async (req, res) => {
  res.render("seller_register", { page: 'seller_register' })
};
exports.registerform = async (req, res) => {
  res.render("register", { page: 'register' });
}
exports.loginform = async (req, res) => {
  res.render("login", { page: 'login' });
}



