    function isAuthenticated(req, res, next) {
        // Checks if the user is authenticated by looking at the session data
        if (req.isAuthenticated()) {
        return next();  // If authenticated, proceed to the route handler
        } else {
        res.redirect("/login");  // If not authenticated, redirect to the login page
        }
    }
    module.exports = isAuthenticated