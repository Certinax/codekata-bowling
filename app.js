const express = require("express");
const hbs = require("hbs");
const path = require("path");
const createError = require("http-errors");
const dotenv = require("dotenv");
dotenv.config();

hbs.registerPartials(__dirname + "/views/partials");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// Starting the server
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
app.listen(port, function() {
  console.log("Express server is running on port: ", port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render error page
  res.status(err.status || 500);
  res.render("error");
});
