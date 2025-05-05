const express = require("express")
const dotenv = require("dotenv").config()
const {neon} = require("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.post("/pushmessage", async (req, res) => {
    try {
        const {message} = req.body
        const user = req.user
        console.log("User:", req.user);
        await sql`INSERT INTO messages(poster_id, message_body) VALUES (${user.username}, ${message})`
        res.redirect("/")
    }
    catch (e) {
        console.log("Error in the push message middleware, ", e)
        res.status(500).json({sucess:false})
    }
})
module.exports = router