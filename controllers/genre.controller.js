const db = require("../models");
const Genre = db.genre;

exports.findAllGenres = (req,res) => {
    Genre.find({})
    .then(data => {
        res.status(200).json({genres: data});
    })
    .catch(error => {
        res.status(500).json({ message: "Error in getting genres" });
    })
}
