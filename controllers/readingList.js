const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingList, User } = require('../models')

router.post('/', async (req, res, next) => {
    const { blogId, userId } = req.body
    try {
      const listedBlog = await ReadingList.create({blogId, userId})
      res.json(listedBlog)
    } catch(error) {
      next(error)
      return res.status(400)
    }
  })

router.get('/', async (req, res) => {
    const blogsInList = await ReadingList.findAll()

    return res.json(blogsInList)
})

//add validUser middleware here
router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {username: req.decodedToken.username}})
    const readingList = await ReadingList.findByPk(req.params.id)
   
    if (user.id !== readingList.userId){
      return res.status(400).json({error: "User can only mark his/her own readinglist as read"})
    }
    
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)

  } catch (e) {
    next(e)
    return res.status(400)
  }
})

module.exports = router