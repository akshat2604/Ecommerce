const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    product = require("./routes/product"),
    user = require("./routes/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    multer = require("multer"),
    sql = require("./models/db"),
    bcrypt = require('bcryptjs');
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", 'ejs');
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.json());
app.use(require("express-session")({
    secret: "QWERTYUIOP",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 100 * 60 * 60 * 24 * 30 }
}));
app.use(cookieParser('secret'));
app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', passwordField: 'password' },
    async function (req, username, password, done) {
        sql.query(`select * from customer where email='${username}'`, (err, user) => {
            if (err)
                return done(null, false, req.flash("error", "Incorrect username and password."));
            else {
                if (user.length != 0) {
                    sql.query(`select * from password where customer_id='${user[0].id}'`, async (err, resi) => {
                        if (err)
                            return done(null, false, req.flash("error", "Incorrect username and password."));
                        else {
                            if (resi.length != 0) {
                                console.log(password, resi[0].password)
                                const result = await bcrypt.compare(password, resi[0].password)
                                if (result == true) {
                                    done(null,user[0]);
                                }
                                else {
                                    return done(null, false, req.flash("error", "Incorrect username and password."));
                                }
                            }
                            else {
                                return done(null, false, req.flash("error", "Incorrect username and password."));
                            }
                        }
                    });
                }
                else {
                    return done(null, false, req.flash("error", "Incorrect username and password."));

                }
            }
        });
    }));
passport.serializeUser(function (user, done) {
    done(null, user.id)
});
passport.deserializeUser(function (id, done) {
    sql.query(`select * from customer where id = '${id}'`, function (err, rows) {
        done(err, rows[0]);
    });
});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", user);
app.use("/", product);
app.get('*', (req, res) => res.send("404"));
app.listen(process.env.PORT || 8080, process.env.IP, function () {
    console.log("Minor Started");
});