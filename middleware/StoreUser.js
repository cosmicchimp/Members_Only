const express = require('express')
const bcrypt = require('bcrypt')
const env = require('env').process
const neon = require("@neondatabase/serverless");
const dotenv = require("dotenv").config()
const sql = neon(process.env.DATABASE_URL)
const router = express.Router()
router.post("https://devsocial.up.railway.app/signup", async (req, res) => {
    try {
        const {username, password} = req.body
        const cryptedPass = bcrypt.hash(password, 10)
        await sql`INSERT INTO mo.users(username, password) VALUES (${username}, ${cryptedPass})`
    }
    catch (e) {
        console.log("Error in user sign up server side... StoreUser.js: ", e)
    }
})