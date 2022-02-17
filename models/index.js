const dbConfig = require("../config/db.config");

const mongoose = require("mongoose");

const db = {};

const {artistModel} = require("./artist.model");

db.mongoose = mongoose;
db.url = dbConfig.url;
db.artist = artistModel();
db.genre = require("./genre.model")(mongoose);
db.movie = require("./movie.model")(mongoose);
db.user = require("./user.model")(mongoose);

module.exports = db;
