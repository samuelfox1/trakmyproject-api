const router = require("express").Router()
const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes")
const projectRoutes = require("./project-routes");

router.use('/user', userRoutes);
router.use('/project', projectRoutes)
router.use('/post', postRoutes)

module.exports = router