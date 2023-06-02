var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var transactionRouter = require("./routes/transactions");
var introductionRouter = require("./routes/introductions");
var commossionRouter = require("./routes/commission");
const log = require("./logs/wirteLogs.js");
var cors = require('cors')

var app = express();
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/transaction", transactionRouter);
app.use("/introduction", introductionRouter);
app.use("/commission", commossionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  log.logger.error(err.message);
  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
