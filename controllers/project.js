const router = require("express").Router();
const db = require("../models");

router.post('/api/project', (req, res) => {
    db.Project.create(req.body)
        .then(project =>
            db.User.findByIdAndUpdate(
                { _id: project.admin },
                { $addToSet: { projects: project._id } })
                .then(data =>
                    res.json(project))
                .catch(err => res.status(500).json(err)))
        .catch(err => res.status(500).json(err))
})

module.exports = router