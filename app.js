const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const morgan = require("morgan");
const passport = require("passport");
const User = require("./models/User");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

// Load config file
env.config({ path: "./config/config.env" })

// Google Auth using Passport js
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, callback_fn) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
        }

        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                callback_fn(null, user);
            } else {
                User.create(newUser)
                    .then((user) => {
                        callback_fn(null, user);
                    });
            }
        } catch (err) {
            console.error(err);
        }
    }
));

passport.serializeUser((user, callback_fn) => {
    callback_fn(null, user.id);
});

passport.deserializeUser((id, callback_fn) => {
    User.findById(id, (err, user) => {
        callback_fn(err, user);
    });
});

const app = express();

app.set("view engine", "ejs");
app.set("layout", "layouts/main", "layouts/login");
app.use(express.static(__dirname + "/public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

// Express Session
app.use(session({
    secret: "my_Secret_key_is_here",
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: process.env.DATABASE_URI,
    })
}));

// DB
mongoose.connect(process.env.DATABASE_URI)
    .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}.`)
    })
    .catch((err) => {
        console.error(err);
    })

// Passport js
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "dev") { app.use(morgan('dev')); }

// Routing
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))