const router = require('express').Router()
const { Op, Sequelize } = require('sequelize')
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({ 
        group: ['author'], 
        attributes: [
            [Sequelize.fn('count', Sequelize.col('id')), 'blogs'], 
            'author',
            [Sequelize.fn('sum', Sequelize.col('likes')), 'total likes']
        ],
        order: [['total likes', 'DESC'] ]
    })
    return res.json(authors)
})

module.exports = router