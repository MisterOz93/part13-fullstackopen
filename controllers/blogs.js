const router = require('express').Router()
const { Op } = require ('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {

  const userQuery = req.query.search ? req.query.search : ''

  const blogs = await Blog.findAll({
      attributes: {
        exclude: ['userId']
      },
      include: {
        model: User,
        attributes: ['name']
      },
      where: {
        [Op.or]: [
          { 
            author: {
              [Op.substring]: userQuery
            }
          },
          {
             title: {
              [Op.substring]: userQuery
            }
          }
        ]
      },
      order: [
        ['likes', 'DESC']
      ],

    })

    res.json(blogs)
  })


router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {username: req.decodedToken.username}})
    const newBlog = await Blog.create({...req.body, userId: user.id })
    return res.json(newBlog) 
  } catch (e) {
    next(e)
    return res.status(400)
  }
})

router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.likes = req.body.likes
    try{
      await blog.save()
      res.json(blog)
    } catch(e) {
      next(e)
      return res.status(400)
    }
  }
  else {
    res.status(404).end()
  }
})
  
router.delete('/:id', tokenExtractor, async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog){
    try {
      const user = await User.findOne({where: {username: req.decodedToken.username}})
      if (user.id === blog.userId){
        await blog.destroy()
      } 
      else {
        return res.status(401).json({error: "Cannot delete another user's blogs"})
      }
    } catch (e){
      next(e)
      return res.status(400)
    }
  }
    return res.status(204).end()
  })

module.exports = router