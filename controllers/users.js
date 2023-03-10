const router = require('express').Router()

const { User, Blog } = require('../models')

const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [{
        model: Blog,
        attributes: {exclude: ['userId']}
      }, {
        model: Blog,
        as: 'readings',
        attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
        through: {
          attributes: []
        }

      }]
  })

  res.json(users)
})

router.get('/:id', async (req, res) => {

  

  let where = {}

  if (req.query.read === 'true'){
    where.read = true
  }
  else if (req.query.read === 'false'){
    where.read = false
  }

  const user = await User.findByPk(req.params.id, {

    attributes: {exclude: ['createdAt', 'updatedAt']},
    include: {
      model: Blog,
      as: 'readings',
      attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
      through: {
        attributes: ['read', 'id'],
        where
      }
    }
})

  return res.json(user)

})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
    return res.status(400)
  }
})

router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({where: { username: req.params.username }})
  if (user) {
   
    try {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } catch (e) {
      next(e)
      return res.status(400)
    }
    
  } else {
    res.status(404).end()
  }
})

module.exports = router