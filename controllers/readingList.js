const router = require('express').Router()

const { ReadingList } = require('../models')

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

module.exports = router