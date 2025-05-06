const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const path = require("path");
const { neon } = require('@neondatabase/serverless'); 
const bcrypt = require("bcrypt")
const Dashboard = require("./routes/DashboardRoute")
const HomeRoute = require("./routes/HomeRoute");
const SignupRoute = require("./routes/SignUpRoute");
const StoreUser = require("./middleware/StoreUser");
const isAuthenticated = require("./middleware/isAuthenticated")
const sql = neon(process.env.DATABASE_URL)
const pushMessage = require("./middleware/pushMessage")
const GuestRoute = require("./routes/GuestRoute")
const LogoutRoute = require("./routes/LogoutRoute")
const DeleteMessage = require("./middleware/DeleteMessage")
const app = express();
// Passport Config ////////////////////////////////////////////////////
passport.use(new LocalStrategy( async (username, password, done) => {
  let data = await sql`SELECT * FROM users WHERE username = ${username}`
  let user = data[0]
  const passwordValid = await bcrypt.compare(password, user.password)
  if (!user || !passwordValid) {
    return done(null, false, { message: "Invalid credentials" });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // only store user ID in session
});

passport.deserializeUser(async (id, done) => {
  const data = await sql`SELECT * FROM users where id = ${id}`
  const user = data[0]
  done(null, user);
});
///////////////////////////////////////////////////////////////////////

// Middleware Order (VERY IMPORTANT)
app.use(bodyParser.urlencoded({ extended: false }));

// Session must come BEFORE passport.session()
app.use(session({
    secret: process.env.COOKIE_SECRET || "12390u09qdfja80h250872135u", // fallback for dev
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { secure: true, rolling:true, maxAge:1000 * 60 * 15}
}));

app.use(passport.initialize());
app.use(passport.session());

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use(HomeRoute);
app.use(SignupRoute);
app.use(Dashboard)
app.use(GuestRoute)
app.use(LogoutRoute)
//Middlewares
app.use(StoreUser);
app.use(pushMessage)
app.use(DeleteMessage)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/', // Redirect on success
    failureRedirect: '/login', // Redirect on failure
    failureFlash: true, // Optional: For displaying flash messages
  }));


// // Start server
// app.listen(4000, () => {
//   console.log("Server running on http://localhost:4000");
// });
