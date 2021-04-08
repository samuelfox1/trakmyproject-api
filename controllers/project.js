const router = require("express").Router();
const db = require("../models");


//  input: object that has key 'project_id'
// action: find the project for the id 
// return: the project object
function findProjectToEdit(rb) {
    return new Promise((resolve, reject) => {
        db.Project.findById(rb.project_id)
            .then(p => resolve(p))
            .catch(() => reject({ admin: null }))
    })
}

//  input: object that has key 'user_id' & 'project_id'
// action: find the user object for the user_id
// return: an array of all project excluding the 'project_id' from input
function getUpdatedProjectsArr(rb) {
    return new Promise((resolve, reject) => {
        db.User.findById(rb.user_id)
            .then(u => {
                const updatedProjectsArray = u.projects.filter(p => p._id != rb.project_id)
                resolve(updatedProjectsArray)
            })
            .catch(() => reject(null))
    })
}

// input 1: object that has key 'user_id'.
// input 2: object containing query instructions
//  action: find the user matching 'user_id', update user with instructions
//  return: updated user object
function updateUserData(rb, instructions) {
    return new Promise((resolve, reject) => {
        db.User.findByIdAndUpdate(rb.user_id, instructions, { new: true }).populate("projects")
            .then(data => resolve(data))
            .catch(() => reject(false))
    })
}

//  input: object that has key 'project_id'
// action: find the project matching 'project_id'
// return: true or false
function deleteProject(rb) {
    return new Promise((resolve, reject) => {
        db.Project.findByIdAndDelete(rb.project_id)
            .then(() => resolve(true))
            .catch(() => reject(false))
    })
}


// create new project
// if creation failed, repond with error message and exit function
// include new project_id in instructions to add to the user that created it
// update users data to include the new projectId
// if update failed, respond with error message and exit function
// send new project back 
router.post('/api/project', async (req, res) => {
    const rb = req.body
    rb.admin_id = rb.user_id // add admin_id property as user_id that created it

    const project = await db.Project.create(rb)
        .then(p => { return p })
        .catch(() => { return false })

    if (!project) {
        res.status(500).json('error, project not created')
        return
    }

    const instructions = { $addToSet: { projects: project._id } }
    const updated = await updateUserData(rb, instructions)

    if (!updated) {
        res.status(500).json('error, user data not updated')
        return
    }

    res.json(project)
})

// edit existing project
// find project to edit
// if no project is found, respond with error message and exit function
// verify that projects admin_id matches the user_id making the request
// if id's do not match, respond with error message and exit function
// setup object and collect data recieved to update the project
// find the project matching 'project_id' and update
// send the updated project object back to user
// if failed, send error message back to user
router.put('/api/project', async (req, res) => {
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

    // setup data object
    const projectData = {
        lastEdited: Date()
    }

    // look for property:value's to add to projectData
    rb.title ? projectData.title = rb.title : null
    rb.public ? projectData.public = rb.public : null
    rb.gitHubRepo ? projectData.gitHubRepo = rb.gitHubRepo : null
    rb.description ? projectData.description = rb.description : null

    db.Project.findByIdAndUpdate(rb.project_id, projectData, { new: true })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err)
        )
})

// delete a project
// find the project to delete, if not found respond with error and exit function
// verify that projects admin_id matches the user_id making the request
// if id's do not match respond with error message and exit function
// get updatedProjectsArray for user deleting the project
// set query instructions and update user's data with updatedProjectsArray
// if update fails, respond with error message and exit function
// delete project from database collection
// if delete fails, respond with error message and exit function
// set response and send data back to user
router.delete('/api/project', async (req, res) => {
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

    const updatedProjectsArr = await getUpdatedProjectsArr(rb)
    const instructions = { $set: { projects: updatedProjectsArr } }
    const updated = await updateUserData(rb, instructions)
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

module.exports = router