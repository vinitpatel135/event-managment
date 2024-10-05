const { Router } = require("express");
const asyncHandeler =require("express-async-handler");
const eventController = require("./EventController");
const userController = require("../Users/UserController");

const eventRouter =Router()


eventRouter.post("/add", userController.AuthGard ,asyncHandeler(eventController.addEvent))
eventRouter.delete("/delete/:id", userController.AuthGard, asyncHandeler(eventController.deleteEvent))
eventRouter.get("/", asyncHandeler(eventController.listEvents))
eventRouter.put("/edit/:id", userController.AuthGard, asyncHandeler(eventController.updateEvent))
eventRouter.get("/userevent/:id", userController.AuthGard, asyncHandeler(eventController.getEventsByUserId))


module.exports = eventRouter