const { PORT } = require('./util/config')
const { connectToDb } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorsRouter = require('./controllers/author')
const readingListRouter = require('./controllers/readingList')
const express = require('express')
const { errorHandler } = require('./util/middleware')

const app = express()


app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)
app.use(errorHandler)

const start = async () => {

  await connectToDb()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

}

start()