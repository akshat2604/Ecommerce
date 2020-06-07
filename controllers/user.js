const user = require("../models/user"),
  passport = require("passport");
exports.register = async (req, res) => {
  user.register(req.body, (err, data) => {
    if (err) {
      const message = err.message;
      if (message.indexOf("ER_DUP_ENTRY") != -1) {
        if (message.indexOf("email") != -1)
          req.flash("error", "Email is Already Used");
        else {
          req.flash("error", "Phone Number is Already Used")
        }
      }
      else {
        req.flash("error", "Something Went Wrong" + err);
      }
      res.redirect("/register")
    }
    else {
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Registered Successfully")
        res.redirect("/");
      });
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
          req.flash("error", "Something Went Wrong" + err);
        }
      }
      res.redirect("/seller/register")
    }
    else {
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Registered Successfully")
        res.redirect("/");
      });
    }
  });
};
exports.logout = async (req, res) => {
  req.flash("success", "Logged Out Successfully");
  req.logout();
  res.redirect("/");
  delete req.session.returnTo;
};
exports.seller_registerform = async (req, res) => {
  res.render("seller_register", { page: 'seller_register' })
};
exports.registerform = async (req, res) => {
  res.render("register", { page: 'register' });
}
exports.loginform = async (req, res) => {
  req.session.returnTo = req.query.origin || '/';
  res.render("login", { page: 'login' });
}
exports.checkout = async (req, res) => {
  user.checkout(req, (err, data) => {
    if (err) {
      if (err != "Empty cart")
        req.flash("error", "Something Went Wrong");
      else
        req.flash("error", err);
      res.redirect("/cart")
    }
    else {
      req.flash("success", "Products Bought")
      res.redirect("/");
    };
  });
};
exports.edit = async (req, res) => {
  res.render("edit", { user: req.user })
}
exports.update = async (req, res) => {
  user.update(req, (err, data) => {
    if (err) {
      const message = err.message;
      if (message.indexOf("ER_DUP_ENTRY") != -1) {
        if (message.indexOf("email") != -1)
          req.flash("error", "Email is Already Used");
        else {
          req.flash("Success", "Phone Number is Already Used")
        }
      }
      else {
        req.flash("error", "Something Went Wrong" + err);
      }
    }
    else {
      req.flash("success", "Details Updated")
      res.redirect("/");
    };
  });
};

exports.previous = async (req, res) => {
  user.previous(req, (err, data) => {
    if (err) {
      if (err != "No previous Order")
        req.flash("error", "Something went wrong" + err);
      else {
        req.flash("error", err);
      }
      res.redirect("/")
    }
    else {
      res.render("product/previous", { data: data });
    };
  });
};
exports.sells = async (req, res) => {
  user.sells(req, (err, data) => {
    if (err) {
      if (err != "No sells Yet")
        req.flash("error", "Something went wrong" + err);
      else {
        req.flash("error", err);
      }
      res.redirect("/")
    }
    else {
      res.render("product/sells", { data: data });
    };
  });
};
