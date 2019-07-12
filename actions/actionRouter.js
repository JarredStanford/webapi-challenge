const express = require('express')

const Actions = require('../data/helpers/actionModel.js')

const router = express.Router();

//GET all actions
router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        console.log(actions)
        res.status(200).json(actions)
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving the actions."
        })
    }
})

//GET specific action
router.get('/:id', async (req, res) => {
    try {
        const action = await Actions.get(req.params.id);
        console.log(action.id)
        if (action !== null) {
            res.status(200).json(action)
        } else {
            res.status(400).json({
                message: "The action with this id could not be found."
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "The action information could not be found (This action id may not exist)."
        })
    }
})

//POST new action
router.post('/:id/', validateAction, async (req, res) => {
    try {
        const newAction = {
            project_id: req.params.id,
            description: req.body.description,
            notes: req.body.notes,
            completed: req.body.completed
        }
        const action = await Actions.insert(newAction);
        res.status(200).json(action)
    } catch (err) {
        res.status(500).json({
            message: "There was an error retrieving the action."
        })
    }
})

//DELETE an action
router.delete('/:id', validateActionID, async (req, res) => {
    try {
        const count = await Actions.remove(req.action)
        res.status(200).json({
            message: `${count} action(s) deleted.`
        })
    } catch (err) {
        res.status(500).json({
            message: "There was an error deleting the action."
        })
    }
})

//PUT update an action
router.put('/:id/', validateAction, validateActionID, async (req, res) => {
    try {
        const updatedAction = {
            project_id: req.body.project_id,
            description: req.body.description,
            notes: req.body.notes,
            completed: req.body.completed
        }
        console.log(updatedAction)
        console.log(req.action)
        const update = await Actions.update(req.params.id, updatedAction)
        console.log(update)
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({
            message: "There was an error updating the action."
        })
    }
})

//custom error checking middleware
async function validateActionID(req, res, next) {
    try {
        const action = await Actions.get(req.params.id)
        console.log(action)
        if (action !== null) {
            req.action = action.id
            next()
        } else {
            res.status(400).json({
                message: "The action with this id does not exist."
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "The action could not be found."
        })
    }
}

function validateAction(req, res, next) {
    Object.keys(req.body).length !== 0
        ? req.body.description && req.body.notes && req.body.project_id
            ? next()
            : res.status(400).json({
                message: "Your action is missing a project ID, name and/or a description."
            })
        : res.status(400).json({ message: "Your action is missing data." })
}

module.exports = router;