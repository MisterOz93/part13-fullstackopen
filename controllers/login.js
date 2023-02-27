const router = require('express').Router()
const{ SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.post('/', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } })

    const passwordCorrect = req.body.password === 'password' //allowable for exercise

    if (! (user && passwordCorrect) ) {
        return res.status(401).json({
            error: "Invalid Username or Password"
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 600 * 600 })

    res.status(200).send({
        token,
        username: user.username,
        name: user.name,
    })
})

module.exports = router