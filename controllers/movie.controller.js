
const db = require("../models");

const utils = require("../utils/utils");
const Movie = db.movie;


exports.findAllMovies = (req, res) => {
    // console.log("Recieved request for find all movies");
    // console.log(req.query);
    const { status, title, genres, artists, start_date, end_date} = req.query;

    let filter = {};
    if (status && status === "PUBLISHED") {
        filter = { published: true }
    }
    else if (status === "RELEASED") {
        filter = { released: true }
    }

    if (title)
        filter.title = title;

    if (genres) {
        let genresArray = genres.split(",");
        filter.genres = { $all: genresArray };
        // console.log("Genres Array: ", genresArray);
    }

    if (artists) {

        const {first_name, last_name} = utils.splitIntoFirstAndLastName(artists);
        filter["artists.first_name"] = { $all: first_name };
        filter["artists.last_name"] = { $all: last_name };
    }

    if(start_date && end_date) {
        // console.log("Entered date if block");
        filter.release_date = {$gte: start_date, $lte:end_date}
    }

    // console.log("Filter object: ", filter);

    Movie.find(filter)
        .then(data => {

            if (data.length !== 0) {
                res.status(200).send(JSON.stringify({movies: data}));
            }
            else {
                res.status(404).json({ message: "Movie not Found" });
            }
        })
        .catch(err => {
            res.status(404).json({ message: "Movies not found" });
        })
}

exports.fineOne = (req, res) => {
    const id = req.params.id;
    // console.log("Id for details: ", id);
    const filter = {movieid: id}
    Movie.find(filter)
        .then(data => {
            if (data.length !== 0) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json({ message: "Movie not Found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error in fetching movie" });
        })
}


exports.findShows = (req, res) => {
    const id = req.params.id;
    let filter = {movieid: id}
    Movie.find(filter)
        .then(data => {
            res.status(200).json(data.shows);
        })
        .catch(err => {
            res.status(404).json({ message: "Movie not found" });
        })
}
