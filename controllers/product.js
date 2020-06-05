const Product = require("../models/product");
exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err) {
      req.flash("error", "Some error occurred ");
      res.status(500).redirect("/");
    }
    else {
      res.render("product/index", { data: data });
    }
  });
};
exports.getbyid = (req, res) => {
  Product.getbyid(req.params.id, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred ");
      res.status(500).redirect("/");
    }
    else {

      res.render("product/show", { data: data });
    }
  });
};
exports.add = (req, res) => {
  Product.add(req.user, req.body, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred ")
      res.status(500).redirect("/");
    }
    else res.status(201).redirect("/");
  });
};
exports.addtocart = (req, res) => {
  console.log("com")
  Product.addtocart(req, (err, data) => {
    console.log(err)
    if (err) {
      req.flash("error", "Some error occurred while adding Product.")
      res.status(500).redirect("/");
    }
    else {
      req.flash("success", "Product added to cart Successfully");
      res.status(200).redirect("/cart");
    }
  });
};
exports.addform = (req, res) => {
  res.render("product/new");
}
exports.getcart = (req, res) => {
  Product.getcart(req,(err, data) => {
    if (err) {
      req.flash("error", "Some error occurred ");
      res.status(500).redirect("/");
    }
    else {
      res.render("product/cart", { data: data });
    }
  });
}