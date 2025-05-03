const express = require("express")
const bcrypt = require("bcrypt")
const {neon} = require("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post("/login", async (req, res) => {
    try { const {username, password} = req.body
    const userData = await sql`SELECT * FROM users WHERE username IN ${username}`
    console.log(userData)}
    catch (e) {console.log("Error in checkuser: ", e)}
   
})
module.exports = router