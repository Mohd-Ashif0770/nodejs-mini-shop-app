const express = require("express");
const app = express();
const connectDb = require("./config/db");
const path = require("path");
const jwt = require('jsonwebtoken')
const methodOverride = require("method-override");
const Port = process.env.PORT;
const adminRoute = require('./routes/adminRoute')
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const cartRoute = require('./routes/cartRoute')
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(cookieParser()); // exposes req.cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || "MySessionKey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(flash());


// ! Default middleware to set res.locals.currUser and flash messages
app.use((req, res, next) => {
  // current user (existing)
  if (req.cookies.userToken) {
    try {
      const user = jwt.verify(req.cookies.userToken, process.env.JWT_SECRET);
      res.locals.currUser = user;
    } catch (err) {
      res.locals.currUser = null;
    }
  } else {
    res.locals.currUser = null;
  }

  // flash (new)
  res.locals.success_msg = req.flash("success") || [];
  res.locals.error_msg = req.flash("error") || [];
  next();
});

app.use("/admin", adminRoute);
app.use("/products", productRoute);
app.use("/", userRoute);
app.use("/cart", cartRoute)



app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

//page not fount
app.all(/.*/, (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(Port , async()=>{
   await connectDb()
  console.log(`Server is running on port ${Port}`)
})