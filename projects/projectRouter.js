const express = require('express');

const Projects = require('../data/helpers/projectModel.js')

const router = express.Router();

//GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Projects.get();
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving the projects."
        })
    }
})

//GET specific project
router.get('/:id', async (req, res) => {
    try {
        const project = await Projects.get(req.params.id);
        if (project.id > 0) {
            res.status(200).json(project)
        }
    } catch (err) {
        res.status(500).json({
            message: "The project information could not be found (This project id may not exist)."
        })
    }
})

//GET actions tied to a project
router.get('/:id/actions', validateProjectID, async (req, res) => {
    try {
        const project = await Projects.getProjectActions(req.project);
        res.status(200).json(project)
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving the list of actions."
        })
    }
})

//POST new project
router.post('/', validateProject, async (req, res) => {
    try {
        const newProject = {
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed
        }
        const project = await Projects.insert(newProject)
        res.status(200).json(project)
    } catch (err) {
        res.status(500).json({
            message: "There was an error creating your post."
        })
    }
})



//DELETE project
router.delete('/:id', validateProjectID, async (req, res) => {
    try {
        const count = await Projects.remove(req.project)
        res.status(200).json({
            message: `${count} project(s) deleted.`
        })
    } catch (err) {
        res.status(500).json({
            message: "There was an error deleting the project."
        })
    }
})

//PUT update a project
router.put('/:id', validateProjectID, async (req, res) => {
    try {
        const updatedProject = {
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed
        }
        const update = await Projects.update(req.project, updatedProject)
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({
            message: "There was an error updating the project."
        })
    }
})


//custom error checking middleware
async function validateProjectID(req, res, next) {
    try {
        const project = await Projects.get(req.params.id)
        if (project.id == req.params.id) {
            req.project = project.id
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: "The project could not be found."
        })
    }
}

function validateProject(req, res, next) {
    Object.keys(req.body).length !== 0
        ? req.body.name && req.body.description
            ? next()
            : res.status(400).json({
                message: "Your project is missing a name and/or a description."
            })
        : res.status(400).json({ message: "Your project is missing data." })
}

module.exports = router;