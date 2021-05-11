// Set up the Express app
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const cors = require("cors");

// app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
app.use(express.json({ type: 'application/json' }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use(cors());


// 'test' setup from https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
const config = require('config'); //load the db location from the JSON files
//db options
let options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true // resolve 'collection.ensureIndex is deprecated. Use createIndexes instead. error message'
};

//db connection
mongoose.connect(process.env.MONGODB_URI || config.DBHost, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(logger('combined')); //'combined' outputs the Apache style LOGs
}

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

module.exports = app; // for testing