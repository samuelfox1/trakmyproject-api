const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config()
const app = express();

const PORT = process.env.PORT || 3001;

/**
 * Logs an error
 * (node:20713) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)
 */
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
// });
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/trakmyproject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true // resolve 'collection.ensureIndex is deprecated. Use createIndexes instead.' error message
});

app.use('/api', require('./controllers'))

app.get('/', (req, res) => {
    res.json({ serverIs: 'running', port: PORT })
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));