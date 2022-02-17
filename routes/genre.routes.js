module.exports = (app) => {
    const genreController = require("../controllers/genre.controller");
    const express = require("express");
    const router = express.Router();

    app.use("/api", router);

    router.get("/genres", genreController.findAllGenres );


}
