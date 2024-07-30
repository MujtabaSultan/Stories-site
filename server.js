const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed");
const path = require("path"); 
const passUserToView = require("./middleware/pass-to-view");
require("./config/db");

const authCtrl = require("./controllers/auth");
const storyCtrl = require("./controllers/story-cntrl");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABSE_URL,
    }),
  })
);

app.use(passUserToView);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/crud`);
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", authCtrl);
app.use(isSignedIn);
app.use("/users", storyCtrl);

app.listen(3000, () => {
  console.log(`The express app is ready on port 3000!`);
});
