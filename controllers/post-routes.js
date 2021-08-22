const router = require("express").Router();
const { verifyAuthorizationToken } = require('../utils/authentication')
const { findProjectByIdToEdit, findProjectByIdKeysToUpdate, updateProjectData, addPostToProject, deleteProject } = require('../utils/projectHelpers')
const { getUsersUpdatedProjectsArr, addProjectToUser } = require('../utils/userHelpers')
const { createPost, findPostToEdit } = require('../utils/postHelpers')

// /api/post
router.post('/', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const rb = req.body
        rb.admin_id = rb.user_id // add admin_id property as user_id that created it
        const post = await createPost(rb)
        if (!post) return res.status(500).json('error, post not created')
        const updated = await addPostToProject(rb, post._id)
        if (!updated) return res.status(500).json('error, project data not updated')
        res.json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/', async (req, res) => {
    try {
        if (!verifyAuthorizationToken(req)) return res.status(401).send('unauthorized')
        const rb = req.body
        const postToEdit = await findPostToEdit(rb)
        if (!postToEdit) return res.status(500).json('error, no project found')
        if (projectToEdit.admin_id != rb.user_id) return res.status(500).json('Not authorized to edit this project')
        const updatedProject = await updateProjectData(rb)
        if (!updatedProject) return res.status(500).json('Project failed to update')
        res.json(updatedProject)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router