const express = require('express')
const {neon} = require("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.post("/deletemessage/:id", async (req, res) => {
    try  {
        const messageId = req.params.id;
        await sql`DELETE FROM messages WHERE messages.id = ${messageId}`
        res.redirect("/") 
    }
    catch (e) {
        console.log("Error in delete message middleware", e)
    }
})

module.exports = router