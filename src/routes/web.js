import express from "express"
import hometroller from "../controllers/HomeController"

let router = express.Router();

let initWebRoutes = (app) =>{
    router.get('/', hometroller.getHomePage);

    router.post('/setup-profile', hometroller.setupProfile);

    app.post('/webhook', hometroller.postWebhook);
    app.get('/webhook', hometroller.getWebhook);

    router.post('/setup-persistent-menu', hometroller.setupPersistentMenu);

    app.get('/booking', hometroller.handleBooking);
    app.post('/set-booking', hometroller.handlePostBooking);

    app.get('/advise', hometroller.handleAdvise);
    app.post('/set-advise', hometroller.handlePostAdvise);
    return app.use('/', router);
};

module.exports = initWebRoutes;