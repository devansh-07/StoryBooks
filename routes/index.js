const express = require("express");
const router = express.Router();
const { ensureAuth, ensureAnony } = require("../middleware/auth");
const Story = require("../models/Story")

// @desc    Login page
// @route   GET /
router.get("/", ensureAnony, (req, res) => {
    res.render("login", {
        layout: "layouts/login",
    });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
    Story.find({user: req.user.id}).lean()
        .then((result) => {
            res.render("dashboard", {
                name: req.user.firstName,
                stories: result,
            });
        })
        .catch((err) => {
            console.error(err);
            res.redirect("errors/500");
        });
});

module.exports = router;