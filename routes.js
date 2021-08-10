const express = require("express");
const router = express.Router();

// Get references to the models.
const { User, Course } = require("./models");

router.get("/users", (req, res) => {
   res.send("Just a test");
});

router.post("/users", (req, res) => {
    res.send("Just a test");
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
            const course = await Course.create({
                title: req.body.title,
                description: req.body.description,
                estimatedTime: req.body.estimatedTime,
                materialsNeeded: req.body.materialsNeeded
            });
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
