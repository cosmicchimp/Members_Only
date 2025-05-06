const express = require('express')
const passport = require('passport')
const router = express.Router()
router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/'); // or wherever you want to redirect after logout
      });
})
module.exports = router