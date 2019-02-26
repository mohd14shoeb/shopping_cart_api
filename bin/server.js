const express = require("express");
const { createServer } = require("http");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const app = express();
const server = createServer(app);

//Require MongoURI
const { MONGO_URI } = require("../config/keys");

//Require All Routes
const indexRoute = require("../routes/api/");
const itemRoute = require("../routes/api/item");
const userRoute = require("../routes/api/user");
const authRoute = require("../routes/api/auth");
const cartRoute = require("../routes/api/cart");

//Setup Http-Logger Middleware
app.use(logger("dev"));

//Setup Body-Parser & Cookie-Parser Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Setup Public Folder Path
app.use("/public", express.static(path.resolve(__dirname, "../public")));

//Initialize Passport
app.use(passport.initialize());
//app.use(passport.session());

//Handling CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    res.status(200).json({});
  }
  next();
});

//Require passport config
require("../config/passport")(passport);

app.use("/test", indexRoute);
app.use("/api", itemRoute);
app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api/cart", cartRoute);

const port = process.env.PORT || 5000;

//MongoDb Connection
mongoose.Promise = require('bluebird');
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true })
  .then(res => {
    server.listen(port, () => console.log(`server running on port ${port}...`));
  })
  .catch(error => {
    throw error.message;
  });
