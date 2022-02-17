module.exports = (app) => {
    const userController = require("../controllers/user.controller");
    const express = require("express");
    const router = express.Router();

    app.use("/api", router);

    router.get("/auth/coupons", userController.getCouponCode);

    router.post("/auth/login", userController.login );

    router.post("/auth/logout", userController.logout );

    router.post("/auth/signup", userController.signUp );



    router.post("/auth/bookings", userController.bookShow);

}
