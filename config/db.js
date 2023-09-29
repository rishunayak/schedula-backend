const mongoose = require("mongoose");

const connection = mongoose.connect(process.env.mongoDB);

module.exports = { connection };
