const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");
require("./config/database");

const authCtrl = require("./controllers/auth");

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

app.listen(3000, () => {
  console.log(`The express app is ready on port ${port}!`);
});
