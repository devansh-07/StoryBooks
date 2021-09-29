function ensuredAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/");
    }
}

function ensuredAnonymous(req, res, next) {
    if (req.isAuthenticated()){
        res.redirect("/dashboard");
    } else {
        return next();
    }
}

module.exports = {
    ensureAuth: ensuredAuthenticated,
    ensureAnony: ensuredAnonymous
}