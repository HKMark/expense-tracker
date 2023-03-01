const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/record')
const Category = require('./models/category')
const mongoose = require('mongoose')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      records = records.map(record => {
        return {
          ...record,
          date: record.date.toISOString().slice(0, 10)
        }
      })
      res.render('index', { records })
    })
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const amount = req.body.amount
  const num = 123456789
  const userId = mongoose.Types.ObjectId(num)
  const categoryId = req.body.category
  return Record.create({ name, date, amount, userId, categoryId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => {
      record.date = record.date.toISOString().slice(0, 10)
      Category.findOne({ id: record.categoryId })
        .lean()
        .then(category => {
          categoryName = category.name
          Category.find()
            .lean()
            .then(categoryList => {
              res.render('edit', { record, categoryName, categoryList })
            })
        })
    })
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const date = req.body.date
  const amount = req.body.amount
  const categoryId = req.body.category
  return Record.findById(id)
    .then(record => {
      record.name = name
      record.date = date
      record.categoryId = categoryId
      record.amount = amount
      return record.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})