const express = require("express")
const bcrypt = require("bcrypt")
const {neon} = require("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.post("/", async (req, res) => {
    try { const {username, password} = res.body
    const userData = await sql`SELECT * FROM users WHERE username IN ${username}`
    console.log(userData)}
    catch (e) {console.log("Error in checkuser: ", e)}
   
})