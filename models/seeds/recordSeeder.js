const bcrypt = require('bcryptjs')
const Category = require('../category')
const Record = require('../record')
const User = require('../user')
const db = require('../../config/mongoose')

const recordsData = require('../../records').results

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(SEED_USER.password, salt)
    const user = await User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    })
    const categoryList = await Category.find().lean()
    await Promise.all(
      recordsData.map(async (record) => {
        const { name, date, amount, category } = record
        const categoriesData = categoryList.find((data) => data.name === category)
        await Record.create({
          name,
          date,
          amount,
          userId: user._id,
          categoryId: categoriesData._id
        })
      })
    )
    console.log('User and Records done.')
    process.exit()
  } catch (err) {
    console.error(err)
  }
})