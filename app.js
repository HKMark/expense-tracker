const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const Record = require('./models/record')
const Category = require('./models/category')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  try {
    const records = await Record.find().lean()
    const mappedRecords = records.map(record => {
      return {
        ...record,
        date: record.date.toISOString().slice(0, 10)
      }
    })
    const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0)
    res.render('index', { records: mappedRecords, totalAmount })
  } catch (error) {
    console.error(error)
  }
})

app.get('/records/new', async (req, res) => {
  res.render('new')
})

app.post('/records', async (req, res) => {
  try {
    const name = req.body.name
    const date = req.body.date
    const amount = req.body.amount
    const num = 123456789
    const userId = mongoose.Types.ObjectId(num)
    const categoryId = req.body.category
    await Record.create({ name, date, amount, userId, categoryId })
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

app.get('/records/:id/edit', async (req, res) => {
  try {
    const id = req.params.id
    const record = await Record.findById(id).lean()
    record.date = record.date.toISOString().slice(0, 10)
    const category = await Category.findOne({ id: record.categoryId }).lean()
    const categoryName = category.name
    const categoryList = await Category.find().lean()
    res.render('edit', { record, categoryName, categoryList })
  } catch (error) {
    console.log(error)
  }
})

app.put('/records/:id', async (req, res) => {
  try {
    const id = req.params.id
    const name = req.body.name
    const date = req.body.date
    const amount = req.body.amount
    const categoryId = req.body.category
    const record = await Record.findById(id)
    record.name = name
    record.date = date
    record.categoryId = categoryId
    record.amount = amount
    await record.save()
    res.redirect(`/`)
  } catch (error) {
    console.log(error)
  }
})

app.delete('/records/:id', async (req, res) => {
  try {
    const id = req.params.id
    const record = await Record.findById(id)
    await record.remove()
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})