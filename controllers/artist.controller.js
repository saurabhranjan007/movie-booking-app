const db = require("../models");


exports.findAllArtists = (req,res) => {
    db.artist.find({})
    .then(data => {
        res.status(200).json({artists: data});
    })
    .catch(error => {
        res.status(500).json({ message: "Error in getting artists" });
    })
}
