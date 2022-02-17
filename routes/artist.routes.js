module.exports = (app) => {
    const artistController = require("../controllers/artist.controller");
    const express = require("express");
    const router = express.Router();

    app.use("/api", router);

    router.get("/artists", artistController.findAllArtists );


}
