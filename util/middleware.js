const { SECRET } = require("./config")
const jwt = require('jsonwebtoken')

const errorHandler = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        const thisError = error.errors[0]
        return res.status(400).send({ error: `Validation error ${thisError.validatorKey} on ${thisError.path}`})
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message})
    }
    console.log('******ERROR NAME IS:*******', error.name)
    console.log('******ERROR msg IS:*******', error.message)
    next(error)
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {

        try {
            req.decodedToken = jwt.verify(auth.substring(7), SECRET)
        } catch {
            return res.status(401).json({error: "Token Invalid"})
        }
    }
    else {
        return res.status(401).json({ error: "Token missing from request"})
    }
    next()
}

module.exports = { errorHandler, tokenExtractor }