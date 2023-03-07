const { SECRET } = require("./config")
const jwt = require('jsonwebtoken')
const { Session, User } = require("../models")

const errorHandler = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        const thisError = error.errors[0]
        return res.status(400).send({ error: `Validation error ${thisError.validatorKey} on ${thisError.path}`})
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message})
    }

    if (error.name === 'TypeError') {
        return res.status(400).send({ error: error.message })
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

const validUser = async (req, res, next) => {
    try {
       
        const user = await User.findOne({where: {username: req.decodedToken.username } })
   
        if (!user){
            return res.status(401).json({error: "User could not be found"})
        }
        if (user.banned){
            return res.status(401).json({error: 'User is banned'})
        }
        const token = req.get('authorization').substring(7)
        const session = await Session.findOne({where: {userId: user.id, token} })

        if (!session) {

            return res.status(401).json({error: "User must be logged in to perform operation"})
        }
        else {
            req.validUser = true
        }
        
    } catch (e) {
        next(e)
    }
  
    next()
}

module.exports = { errorHandler, tokenExtractor, validUser }