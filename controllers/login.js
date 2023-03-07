const router = require('express').Router()
const{ SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')

router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } })

    const passwordCorrect = req.body.password === 'password' //allowable for exercise

    if (! (user && passwordCorrect) ) {
        return res.status(401).json({
            error: "Invalid Username or Password"
        })
    }

    if (user.banned){
        return res.status(401).json({
            error: "User is banned."
        })
    }

    let session = await Session.findOne({where: {userId: user.id}})

    if (session) {
        return res.status(401).json({
            error: "User is already logged in and must log out before logging in again."
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    session = await Session.create({userId: user.id, token})
    
 
    //session deleted in logout route

    res.status(200).send({
        token,
        username: user.username,
        name: user.name,
    })
})


module.exports = router