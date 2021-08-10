const express = require("express");
const router = express.Router();

// Get references to the models.
const { User, Course } = require("./models");

router.get("/users",async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post("/users",async (req, res) => {
    try {
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        });
        res.status(201).location("/");
    } catch (err) {
        res.status(400).json({message: "Sorry, bad request"});
    }
});

router.get("/courses", async (req, res) => {
    try{
        const courses = await Course.findAll();
        res.json(courses);
    } catch (err) {
        res.status(404).json({message: "Sorry, courses not found"});
    }

});

router.get("/courses/:id",async (req, res) => {
    try{
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId, {
            include: [
                {
                    model: User
                },
            ],
        });
        res.json(course);
    } catch (err) {
        res.status(404).json({message: "Sorry, course not found"});
    }
});

router.post("/courses",async (req, res) => {
    try{
        if (req.body.title && req.body.description) {
            const course = await Course.create(req.body);
        }
    } catch (err) {
        res.status(400).json({message: "Sorry, bad request"});
    }
});

router.put("/courses/:id", (req, res) => {
    res.send("Just a test");
});

router.delete("/courses/:id", (req, res) => {
    res.send("Just a test");
});

module.exports = router;
