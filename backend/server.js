const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const morgan = require("morgan");
const logger = require("./utils/logger");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const { connectDB } = require("./config/db");

// Routes
const mountRoutes = require("./routes");

// Connect with db
connectDB();

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
} else {
  app.use(logger);
}


// Limit each IP to 4 requests per `window` (here, per 15 minutes)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 4, // Corrected to allow 4 requests per 15 minutes
//   message: {
//     message:
//       "Trop de demandes provenant de cette adresse IP, veuillez réessayer après une heure.",
//   },
// });

// Apply the rate limiting middleware to all requests
// app.use("/user/forgotPassword", limiter);

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cannot find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});

// Handle rejection outside express
// process.on("unhandledRejection", (err) => {
//   console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
//   server.close(() => {
//     console.error(`Éteindre....`);
//     process.exit(1);
//   });
// });