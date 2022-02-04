const validator = require("express-validator");
const path = require("path");
const user = require("../models/user");
const bcrypt = require('bcrypt');
const controller = {
  login: (req, res) =>
    res.render("users/login", { styles: ["login"], title: "Log in" }),
  register: (req, res) =>
    res.render("users/register", { styles: ["register"], title: "Registro" }),
  profile: (req, res) =>
    res.render("users/profile", { styles: ["profile"], title: "Perfil" }),
  access: (req, res) => {
    const errors = validator.validationResult(req);
    let usuarioExiste = user.search("email", req.body.email);

      /* if(!bcrypt.compareSync(req.body.password, usuarioExiste.password)){
        return res.render('users/login',{
        title: 'Log in',
        styles: ["login"],
        errors: errors.mapped(),
        user: req.body,
      })*/
    

    if (errors.isEmpty()) {
      req.session.user = usuarioExiste
      req.body.remember
        ? res.cookie("user", req.session.user.email, {maxAge:  1000*60*60*24*7})
        : null;    
      //return res.redirect("/");      
    
    } else {
      res.render("users/login", {
        title: 'Log in',
        styles: ["login"],
        errors: errors.mapped(),
        user: req.body,
      });
    }

    return res.redirect("/users/profile");      

  },
  save: (req, res) => {
    const errors = validator.validationResult(req);
    if (errors.isEmpty()) {
      const create = user.create(req.body);
      return res.redirect("/users/login");
    } else {
      return res.render("user/register", {
        errors: errors.mapped(),
        user: req.body,
      });
    }
    //return errors.isEmpty() ? res.send(user.create(req.body)) : res.send(errors.mapped()) ;
  },
  logout: (req, res) => {
    delete req.session.user;
    res.cookie("email", null, { maxAge: -1 });
    return res.redirect("/");
  },
};

module.exports = controller;
