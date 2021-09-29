const express = require("express");
const router = express.Router();
const { ensureAuth, ensureAnony } = require("../middleware/auth");
const Story = require("../models/Story")

// @desc    Show add form
// @route   GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

// @desc    Process add form
// @route   POST /stories
router.post("/", ensureAuth, (req, res) => {
    req.body.user = req.user.id;
    Story.create(req.body)
        .then((result) => {
            res.redirect("/dashboard");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("errors/500");
        });
});

// @desc    Show all stories
// @route   GET /stories
router.get("/", ensureAuth, (req, res) => {
    Story.find({status: "public"})
        .populate('user')
        .sort({createdAt: -1})
        .then((stories) => {
            res.render("stories/index", {user: req.user, stories: stories});
        })
        .catch((err) => {
            console.log(err);
            res.redirect("errors/500");
        })
});

// @desc    Edit story
// @route   GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, (req, res) => {
    Story.findOne({
        _id: req.params.id,
    }).then((story) => {
        if (story.user != req.user.id) {
            res.redirect("/stories");
        } else {
            res.render("stories/edit", {story: story})
        }
    }).catch((err) => {
        console.log(err);
        res.redirect("errors/404");
    });
});

// @desc    Update story
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, (req, res) => {
    Story.findById(req.params.id)
        .then((story) => {
            if (story.user != req.user.id) {
                res.redirect("/stories");
            } else {
                return Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                    new: false,
                    runValidators: true
                });
            }
        })
        .then((story) => {
            console.log("Updated!");
            res.redirect("/dashboard");
        })
        .catch((err) => {
            console.log(err);
            res.render("errors/404")
        });
});

// @desc    Delete Story
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, (req, res) => {
    Story.findById(req.params.id)
        .then((story) => {
            if (story.user != req.user.id) {
                res.redirect("/stories");
            } else {
                return Story.findOneAndDelete({_id: req.params.id});
            }
        })
        .then((story) => {
            console.log("Deleted!");
            res.redirect("/dashboard");
        })
        .catch((err) => {
            console.log(err);
            res.render("errors/404")
        });
});

// @desc    Show Story
// @route   GET /stories/:id
router.get("/:id", ensureAuth, (req, res) => {
    Story.findById(req.params.id)
        .populate('user')
        .then((story) => {
            res.render("stories/show", {user: req.user, story});
        })
        .catch((err) => {
            console.log(err);
            res.render("errors/404")
        });
});

// @desc    User Story
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, (req, res) => {
    Story.find({
            user: req.params.userId,
            status: "public"
        })
        .populate('user')
        .then((stories) => {
            res.render("stories/index", {user: req.user, stories: stories});
        })
        .catch((err) => {
            console.log(err);
            res.render("errors/404")
        });
});

module.exports = router;