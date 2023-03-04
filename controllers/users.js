const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [{
        model: Blog,
        attributes: {exclude: ['userId']}
      }, {
        model: Blog,
        as: 'reading_list',
        attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
        through: {
          attributes: []
        }

      }]
  })

  res.json(users)
})

router.get('/:id', async (req, res, next) => {

  const user = await User.findByPk(req.params.id, {
    attributes: {exclude: ['createdAt', 'updatedAt']},
    include: {
      model: Blog,
      as: 'reading_list',
      attributes: {exclude: ['createdAt', 'updatedAt', 'userId']},
      through: {
        attributes: []
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