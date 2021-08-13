const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./middleware/auth-user");
const bcrypt = require("bcryptjs");

// Get references to the models.
const { User, Course } = require("./models");

router.get("/users", authenticateUser, async (req, res) => {
    if (authenticateUser) {
        try {
            const user = await User.findByPk(req.currentUser.id, {
                attributes: {
                    exclude: ["password", "createdAt", "updatedAt"]
                }
            });
            res.json(user);
        } catch (err) {
            res.status(404).json({message: "User not found"});
        }
    }
});

router.post("/users", async (req, res) => {
    try {
        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, encryptedPassword) => {
                try {
                    if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
                        await User.create({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            emailAddress: req.body.emailAddress,
                            password: encryptedPassword
                        });
                        res.status(201).location("/").end();
                    } else {
                        res.status(400).json({message: "New user must include: firstName, lastName, emailAddress, and password"});
                    }
                } catch (err) {
                    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                        const sequelizeValidationError = err.errors.map(err => "Please provide a unique, properly formatted email address");
                        res.status(400).json({ sequelizeValidationError });
                    } else {
                        console.log(err);
                        res.status(400).json({message: "Sorry, bad request"});
                    }
                }
            });
        });
    } catch (err) {
        res.status(400).json({message: "Bad HTTP Request"});
    }
});

router.get("/courses", async (req, res) => {
    try{
        const courses = await Course.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: User,
                },
            ],
        });
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({message: "Sorry, courses not found"});
    }

});

router.get("/courses/:id",async (req, res) => {
    try{
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId, {
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: User
                },
            ],
        });
        res.status(200).json(course);
    } catch (err) {
        res.status(404).json({message: "Sorry, course not found"});
    }
});

router.post("/courses", authenticateUser, async (req, res) => {
    if (authenticateUser) {
        try {
            if (req.body.title && req.body.description) {
                const course = await Course.create({
                    "title": req.body.title,
                    "description": req.body.description,
                    "estimatedTime": req.body.estimatedTime,
                    "materialsNeeded": req.body.materialsNeeded,
                    "userId": req.currentUser.id
                });
                res.status(201).location(`/courses/${course.id}`).end();
            } else {
                res.status(400).json({message: "Course must include a title and description"});
            }
        } catch (err) {
            res.status(400).json({message: "Bad HTTP Request"});
        }
    }
});


router.put("/courses/:id", authenticateUser, async (req, res) => {
    if (authenticateUser) {
        try {
            if (req.body.title && req.body.description) {
                const course = await Course.findByPk(req.params.id);
                if (course.userId === req.currentUser.id) {
                    course.title = req.body.title;
                    course.description = req.body.description;
                    course.estimatedTime = req.body.estimatedTime;
                    course.materialsNeeded = req.body.materialsNeeded;
                    course.userId = req.currentUser.id;
                    await course.save();
                    res.status(204).location(`/courses/${course.id}`).end();
                } else {
                    res.status(403).json({message: "You are not authorized to update this course"});
                }
            } else {
                res.status(400).json({message: "Updated course MUST include both a title and a description"})
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Bad HTTP Request"});
        }
    }
});

router.delete("/courses/:id", authenticateUser, async (req, res) => {
    if (authenticateUser) {
        try {
            const course = await Course.findByPk(req.params.id);
            if (course.userId === req.currentUser.id) {
                await course.destroy();
                res.status(204).end();
            } else {
                res.status(403).json({message: "You are not authorized to delete this course"});
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Bad HTTP Request"});
        }
    }

});

module.exports = router;
