const express = require('express')
const router = express.Router()
const passport = require("passport")
require("dotenv").config();
const { neon } = require("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const isAuthenticated = require("../middleware/isAuthenticated")
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const messages = await sql`SELECT * FROM messages`
        const friends = [1]
        res.render("Dashboard", {
            user:req.user,
            messages:messages
        })
    }
    catch (e) {
        console.log("Error in dashboard route: ", e)
    }
})
module.exports = router