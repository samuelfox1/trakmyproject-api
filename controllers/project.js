const router = require("express").Router();
const db = require("../models");
const { authenticateUser } = require('../utils/authentication')
const { getUsersUpdatedProjectsArr, addProjectToUser } = require('../utils/userHelpers')
const {
    createProject,
    findProjectToEdit,
    findProjectKeysToUpdate,
    updateProjectData,
    deleteProject
} = require('../utils/projectHelpers')


router.post('/api/project', async (req, res) => {
    // const authenticated = authenticateUser(req)
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    rb.admin_id = rb.user_id // add admin_id property as user_id that created it
    const project = await createProject(rb)
    if (!project) {
        res.status(500).json('error, project not created')
        return
    }
    const updated = await addProjectToUser(rb, project._id)
    if (!updated) {
        res.status(500).json('error, user data not updated')
        return
    }
    res.json(project)
})

router.put('/api/project', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body
    const projectToEdit = await findProjectToEdit(rb)

    if (!projectToEdit) {
        res.status(500).json('error, no project found')
        return
    }
    if (projectToEdit.admin_id != rb.user_id) {
        res.status(500).json('Not authorized to edit this project')
        return
    }
    const updatedProject = await updateProjectData(rb)
    if (!updatedProject) {
        res.status(500).json('Project failed to update')
        return
    }
    res.json(updatedProject)
})

router.delete('/api/project', async (req, res) => {
    // const authenticated = authenticateUser(req) //must pass in full req to access body and headers
    // if (!authenticated) {
    //     res.status(403).json(`User doesn't have enough privilege`)
    //     return
    // }
    const rb = req.body

    const projectToDelete = await findProjectToEdit(rb)
    if (!projectToDelete) {
        res.status(500).json('invalid id to delete')
        return
    }

    if (projectToDelete.admin_id != rb.user_id) {
        res.status(500).json('Not authorized to delete this project')
        return
    }

    const updatedProjectsArr = await getUsersUpdatedProjectsArr(rb)
    const instructions = { $set: { projects: updatedProjectsArr } }
    const updated = await addProjectToUser(rb, instructions)
    if (!updated) {
        res.status(500).json('error: project not deleted from user')
        return
    }
    const deleted = await deleteProject(rb)
    if (!deleted) {
        res.status(500).json('error: project not deleted from collection')
        return
    }

    const response = {
        message: 'delete success',
        updatedProjects: updated.projects
    }
    res.json(response)
})


router.get('/api/project', (req, res) => {
    const rb = req.body
    db.Project.findOne({ _id: rb.project_id })
        .populate('entries')
        .then(project => res.json(project))
        .catch(err => res.statrus(500).json(err))
})

module.exports = router