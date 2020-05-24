const user = require("../models/user");
exports.register = async (req, res) => {
  user.register(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating customer."
      });
    else res.status(201).send(data);
  });
};
exports.login = async (req, res) => {
  user.login(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while logging in."
      });
    else res.status(200).send(data);
  });
};
exports.logout = async (req, res) => {
  user.logout(req, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while logging out."
      });
    else res.status(200).send(data);
  });
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

