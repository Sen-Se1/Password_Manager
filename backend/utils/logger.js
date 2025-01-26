const fs = require("fs");
const morgan = require("morgan");

// Create a write stream (in append mode) to log the requests
const accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });

// Custom format for logging
const logFormat =
  '[:date[iso]] | Method: ":method" | Url: ":url" | Status: :status | Response-Time: :response-time ms | Response-Content-Length: :res[content-length] | IP Address: :remote-addr';

  // Create a middleware function that logs the requests
const logger = morgan(logFormat, { stream: accessLogStream });

module.exports = logger;