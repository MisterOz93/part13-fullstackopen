const router = require('express').Router()
const{ SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { tokenExtractor, validUser } = require('../util/middleware')
const { Session, User } = require('../models')

router.delete('/', tokenExtractor, validUser, async (req, res, next) => {
    try {
        const user = await User.findOne({where: {username: req.decodedToken.username}})
        if (req.validUser){
            const session = await Session.findOne({where: {userId: user.id} })   
            await session.destroy()
            return res.status(200).json({message: 'logout successful'})
        }
        else {
            res.status(400).json({error: "Incorrect token provided in request"})
        }
    } catch (e) {
        next(e)
        return res.status(400).end()
    }

})

router.get('/sessions', async (req, res) => {
    const sessions = await Session.findAll()
    res.json(sessions)
})

module.exports = router