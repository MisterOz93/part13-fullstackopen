const errorHandler = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        const thisError = error.errors[0]
        return res.status(400).send({ error: `Validation error ${thisError.validatorKey} on ${thisError.path}`})
    }
    if (error.name === 'SequelizeDatabaseError' && 
    error.message.includes('invalid input syntax for integer')){
        return res.status(400).send({ error: 'Request must have valid integer value for blog.likes'})
    }
    console.log('******ERROR NAME IS:*******', error.name)
    console.log('******ERROR msg IS:*******', error.message)
    next(error)
}

module.exports = { errorHandler }