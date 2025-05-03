const express = require('express')
const bcrypt = require('bcrypt')
const env = require('env').process
const neon = require("@neondatabase/serverless");
const dotenv = require("dotenv").config()
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.post("/signupuser", async (req, res) => {
    try {
        const {username, password} = req.body
        const cryptedPass = await bcrypt.hash(password, 10)
        await sql`INSERT INTO mo.users(username, password) VALUES (${username}, ${cryptedPass})`
        res.send("project created")
    }
    catch (e) {
        console.log("Error in user sign up server side... StoreUser.js: ", e)
    }
})