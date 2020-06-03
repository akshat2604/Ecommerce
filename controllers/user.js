const user = require("../models/user");
exports.register = async (req, res) => {
  user.register(req.body, (err, data) => {
    if (err) {
      const message=err.message;
      if (message.indexOf("ER_DUP_ENTRY")!=-1) {
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
    else res.status(201).redirect("/user/login");
  });
}
exports.login =

  exports.logout = async (req, res) => {
    req.flash("success", "Logged Out Successfully");
    req.logout();
    res.redirect("/");
    delete req.session.returnTo;
  };
exports.logoutofall = async (req, res) => {
  user.logoutofall(req, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while logging out."
      });
    else res.status(200).send(data);
  });
};
exports.registerform = async (req, res) => {
  res.render("register", { page: 'register' });
}
exports.loginform = async (req, res) => {
  res.render("login", { page: 'login' });
}



