const mongoose = require("mongoose");

const artistModel = () => {

    const Artist = mongoose.model("artist", artistSchema);
    return Artist;
}

const artistSchema = mongoose.Schema({
    artistid: {
        required: true,
        type: Number
    },
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    wiki_url: {
        requied: false,
        type: String,
    },
    profile_url: {
        requied: false,
        type: String,
    },
    movies: [String]
},
    { timeStamps: true }
);

module.exports = {
    artistModel, artistSchema
}
