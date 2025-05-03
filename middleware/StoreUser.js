const express = require('express')
const bcrypt = require('bcrypt')
const dotenv = require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless'); // Correct importconst sql = neon(process.env.DATABASE_URL)
const sql = neon({ connectionString: process.env.DATABASE_URL }); // Correct way to initialize Neon
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post("/", async (req, res) => {
    try {
        const {username, password} = req.body
        const cryptedPass = await bcrypt.hash(password, 10)
        await sql`INSERT INTO mo.users(username, password, isMember) VALUES (${username}, ${cryptedPass}, FALSE)`
        res.send("project created")
    }
    catch (e) {
        console.log("Error in user sign up server side... StoreUser.js: ", e)
        res.status(500).send("error in creating user")
    }
})

module.exports = router