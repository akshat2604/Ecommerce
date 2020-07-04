const Product = require("../models/product");
exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err) {
      req.flash("error", "Some error occurred " + err);
      res.status(500).redirect("/");
    }
    else {
      if (req.xhr)
        res.json(data);
      else
        res.render("product/index", { data: data });
    }
  });
};
exports.getbyid = (req, res) => {
  Product.getbyid(req, req.params.id, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred " + err);
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
      req.flash("error", "Some error occurred " + err)
      res.status(500).redirect("/");
    }
    else res.status(201).redirect("/");
  });
};
exports.addtocart = (req, res) => {
  Product.addtocart(req, res, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred while adding Product." + err)
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
  Product.getcart(req, async (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred " + err);
      res.status(500).redirect("/");
    }
    else {
      res.render("product/cart", { data: data });
    }
  });
};
exports.deletefromcart = (req, res) => {

  Product.deletefromcart(req, async (err, data) => {
    if (err) {
      if (err != "Product is not in your cart")
        req.flash("error", "Some error occurred " + err);
      else {
        req.flash("error", err);
      }
      res.status(500).redirect("/cart");
    }
    else {
      req.flash("success", "Product removed")
      res.redirect("/cart");
    }
  });
}
exports.delete = (req, res) => {
  Product.delete(req, async (err, data) => {
    if (err) {
      if (err != "You have no such Product")
        req.flash("error", "Some error occurred " + err);
      else {
        req.flash("error", err);
      }
      res.status(500).redirect("/");
    }
    else {
      req.flash("success", "Product removed")
      res.redirect("/my");
    }
  });
}
exports.my = (req, res) => {
  Product.my(req, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred ");
      res.status(500).redirect("/");
    }
    else {
      res.render("product/index", { data: data });
    }
  });
};
exports.editform = (req, res) => {
  Product.getbyid(req, req.params.id, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred " + err);
      res.status(500).redirect("/");
    }
    else {
      res.render("product/edit", { data: data });
    }
  });
};
exports.edit = (req, res) => {
  Product.edit(req, (err, data) => {
    if (err) {
      if (err != "You have no such Product")
        req.flash("error", "Some error occurred " + err);
      else {
        req.flash("error", err);
      }
      res.status(500).redirect("/my");
    }
    else {
      res.redirect("/my")
    }
  });
};
exports.search = (req, res) => {
  conole.log("search")
  Product.search(req, res, (err, data) => {
    if (err) {
      req.flash("error", "Some error occurred " + err);
      res.status(500).redirect("/");
    }
    else {
      if (data.length == 0) {
        req.flash("error", "No search results found")
        res.redirect("/")
      }
      else {
        req.flash("success", "Search results found ")
        res.render("product/index", { data: data });
      }
    }
  });
};