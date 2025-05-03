const dotenv = require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const { neon } = require('@neondatabase/serverless'); 

// Log the database URL to ensure it's loaded properly
console.log("Connecting to Neon with:", process.env.DATABASE_URL);

// Correct usage of neon
const sql = neon(process.env.DATABASE_URL, // Correct connection string
);

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/signupuser", async (req, res) => {
    try {
        const { username, password } = req.body;
        const cryptedPass = await bcrypt.hash(password, 10);
        await sql`INSERT INTO mo.users(username, password, isMember) VALUES (${username}, ${cryptedPass}, FALSE)`;
        res.send("project created");
    } catch (e) {
        console.log("Error in user sign up server side... StoreUser.js: ", e);
        res.status(500).send("error in creating user");
    }
});

module.exports = router;
