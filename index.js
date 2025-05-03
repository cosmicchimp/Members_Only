const express = require("express")
const HomeRoute = require("./routes/HomeRoute")
const SignupRoute = require("./routes/SignUpRoute")
const StoreUser = require("./middleware/StoreUser")
const CheckUser = require("./middleware/CheckUser")
const path = require("path");  
const app = express()
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.use(HomeRoute)
app.use(SignupRoute)
app.post("/login", CheckUser)
app.post("/signupuser", StoreUser);
app.listen(4000, () => {
    console.log("Server running on local")
})