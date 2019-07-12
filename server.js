const express = require("express")
const helmet = require("helmet")

//routes
const actionRouter = require('./actions/actionRouter.js')
const projectRouter = require('./projects/projectRouter.js')


const server = express();

server.get('/', (req, res) => {
    res.send(`<h1>Project & Action Warehouse</h1>`)
})

//middleware
function logger(req, res, next) {
    console.log(`${req.method} to ${req.path} @ ${Date.now()}`)
    next();
}


server.use(logger);
server.use(helmet());
server.use(express.json());

server.use('/api/actions', actionRouter)
server.use('/api/projects', projectRouter)

module.exports = server;