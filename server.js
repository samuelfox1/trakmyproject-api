// Set up the Express app
const express = require("express");
const logger = require("morgan");
const app = express();
const cors = require("cors");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use(cors());

// Database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/trakmyproject", { // connect to database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true // resolve 'collection.ensureIndex is deprecated. Use createIndexes instead. error message'
});

// User Routes
const userRoutes = require("./controllers/user");
app.use(userRoutes);

// Project Routes
const projectRoutes = require("./controllers/project");
app.use(projectRoutes)

// Entry Routes 
const entryRoutes = require("./controllers/entry")
app.use(entryRoutes)


// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});