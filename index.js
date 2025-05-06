const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const path = require("path");
const { neon } = require('@neondatabase/serverless'); 
const bcrypt = require("bcrypt");
const Dashboard = require("./routes/DashboardRoute");
const HomeRoute = require("./routes/HomeRoute");
const SignupRoute = require("./routes/SignUpRoute");
const StoreUser = require("./middleware/StoreUser");
const pushMessage = require("./middleware/pushMessage");
const GuestRoute = require("./routes/GuestRoute");
const LogoutRoute = require("./routes/LogoutRoute");
const DeleteMessage = require("./middleware/DeleteMessage");

const app = express();

// Set the trust proxy (important for production behind a proxy like Railway)
app.set("trust proxy", 1);

// Get the port from Railway environment variable or fallback to 4000
const PORT = process.env.PORT || 4000;

// Set up database connection using the Neon serverless database
const sql = neon(process.env.DATABASE_URL); 

// Passport Configuration ////////////////////////////////////////////////////
passport.use(new LocalStrategy(async (username, password, done) => {
  let data = await sql`SELECT * FROM users WHERE username = ${username}`;
  let user = data[0];
  const passwordValid = await bcrypt.compare(password, user.password);
  
  if (!user || !passwordValid) {
    return done(null, false, { message: "Invalid credentials" });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Only store user ID in session
});

passport.deserializeUser(async (id, done) => {
  const data = await sql`SELECT * FROM users where id = ${id}`;
  const user = data[0];
  done(null, user);
});
// End of Passport Configuration ////////////////////////////////////////////////////

// Middleware Order (VERY IMPORTANT)
app.use(bodyParser.urlencoded({ extended: false }));

// Session Configuration (ensure secure cookies in production)
app.use(session({
  secret: process.env.COOKIE_SECRET || "12390u09qdfja80h250872135u", // fallback for dev
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production
    rolling: true,
    maxAge: 1000 * 60 * 15, // 15 minutes session expiry
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use(HomeRoute);
app.use(SignupRoute);
app.use(Dashboard);
app.use(GuestRoute);
app.use(LogoutRoute);

// Middlewares
app.use(StoreUser);
app.use(pushMessage);
app.use(DeleteMessage);

// Login POST Route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/', // Redirect on success
  failureRedirect: '/login', // Redirect on failure
  failureFlash: true, // Optional: For displaying flash messages
}));

// Start server on Railway with proper port setting
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
