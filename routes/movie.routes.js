module.exports = (app) => {
    const movieController = require("../controllers/movie.controller");
    const express = require("express");
    const router = express.Router();

    app.use("/api", router);

    router.get("/movies", movieController.findAllMovies );

    router.get("/movies/:id", movieController.fineOne);

    router.get("/movies/:id/shows", movieController.findShows);
}
