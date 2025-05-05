const express = require("express")
const route = express.Router() 
const isAuthenticated = require("../middleware/isAuthenticated")
route.get("/login", (req, res) => {
    res.render("HomeView")
})
module.exports = route