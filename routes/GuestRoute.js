const express = require("express");
const router = express.Router();
const passport = require("passport");

// This will mimic the POST to /login using LocalStrategy
router.get("/guestentry", (req, res, next) => {
  // Create a fake POST body
  req.body = {
    username: "guest",
    password: "guest"
  };

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).send("Authentication error");
    }
    if (!user) {
      console.warn("Guest login failed:", info);
      return res.status(401).send("Guest login failed");
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login session error:", err);
        return res.status(500).send("Login failed");
      }

      // Success — redirect to dashboard
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
