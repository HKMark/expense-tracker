const bcrypt = require('bcryptjs')
const Category = require('../category')
const Record = require('../record')
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all([
        Record.create({ name: '午餐', date: '2019-04-23', amount: '60', userId, categoryId: '4' }),
        Record.create({ name: '晚餐', date: '2019-04-23', amount: '60', userId, categoryId: '4' }),
        Record.create({ name: '捷運', date: '2019-04-23', amount: '120', userId, categoryId: '2' }),
        Record.create({ name: '電影：驚奇隊長', date: '2019-04-23', amount: '220', userId, categoryId: '3' }),
        Record.create({ name: '租金', date: '2015-04-01', amount: '25000', userId, categoryId: '1' })
      ])
    })
    .then(category => {
      return Promise.all([
        Category.create({ id: '1', name: '家居物業' }),
        Category.create({ id: '2', name: '交通出行' }),
        Category.create({ id: '3', name: '休閒娛樂' }),
        Category.create({ id: '4', name: '餐飲食品' }),
        Category.create({ id: '5', name: '其他' })
      ])
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})