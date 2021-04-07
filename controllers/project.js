const router = require("express").Router();
const db = require("../models");

router.post('/api/project', (req, res) => {
    db.Project.create(req.body)
        .then(project =>
            db.User.findByIdAndUpdate(
                project.admin,
                { $addToSet: { projects: project._id } })
                .then(data =>
                    res.json(project))
                .catch(err => res.status(500).json(err)))
        .catch(err => res.status(500).json(err))
})

router.put('/api/project', (req, res) => {
    let x = req.body
    console.log(x)
    db.Project.findByIdAndUpdate(
        req.body.id, // id to find
        { // data to update
            name: x.name,
            public: x.public,
            gitHubRepo: x.gitHubRepo,
            description: x.description,
            lastEdited: Date()
        },
        { new: true } // option to send back the updated document
    )
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err)
        )
})

module.exports = router