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
    db.Project.findByIdAndUpdate(
        x.id, // id to find
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

router.delete('/api/project', async (req, res) => {
    const rb = req.body
    const projectToDelete = await findProjectToDelete(rb)
    if (!projectToDelete) res.status(500).json('invalid id to delete')
    if (projectToDelete.admin != rb.user_id) res.status(500).json('not authorized to delete')
    else {
        const updatedProjectsArr = await getUpdatedProjectsArr(rb)
        const updated = await updateAdminsProjects(rb, updatedProjectsArr)
        const deleted = await deleteProject(rb)
        if (updated && deleted) res.json({ message: 'delete success', updatedProjects: updated.projects })
        else res.status(500).json('delete failure')
    }

    function findProjectToDelete(rb) {
        return new Promise((resolve, reject) => {
            db.Project.findById(rb.project_id)
                .then(p => resolve(p))
                .catch(err => reject({ admin: null }))
        })
    }

    function deleteProject(rb) {
        return new Promise((resolve, reject) => {
            db.Project.findByIdAndDelete(rb.project_id)
                .then(data => resolve(data))
                .catch(err => reject(null))
        })
    }

    function getUpdatedProjectsArr(rb) {
        return new Promise((resolve, reject) => {
            db.User.findById(rb.user_id)
                .then(admin => {
                    const newArr = admin.projects.filter(p => p._id != rb.project_id)
                    resolve(newArr)
                })
                .catch(err => reject(null))
        })
    }

    function updateAdminsProjects(rb, newArray) {
        return new Promise((resolve, reject) => {
            if (!newArray) reject(false)
            db.User.findByIdAndUpdate(rb.user_id, { $set: { projects: newArray } }, { new: true }).populate("projects") // remove the project id from admin's projects property
                .then(data => resolve(data))
                .catch(err => reject(false))
        })
    }
})

module.exports = router