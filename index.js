const express = require("express")
const HomeRoute = require("./routes/HomeRoute")
const SignupRoute = require("./routes/SignUpRoute")
const path = require("path");  
const app = express()
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.use('/', HomeRoute)
app.use("/signup", SignupRoute)
app.listen(4000, () => {
    console.log("Server running on local")
})