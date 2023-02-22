require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const run = async () => {
    try {
        await sequelize.authenticate()
        const blogs = await sequelize.query('Select * from blogs', {type: QueryTypes.SELECT})
        console.log(blogs)
        sequelize.close()
    }
    catch (error) {
        console.error('Unable to connect to the database:', error)
      }
}

run()