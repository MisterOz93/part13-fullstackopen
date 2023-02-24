const { PORT } = require('./util/config')
const { connectToDb } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const express = require('express')
const { errorHandler } = require('./util/middleware')

const app = express()


app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

const start = async () => {

  await connectToDb()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

}

start()