const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', async (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  try {
    const name = req.body.name
    const date = req.body.date
    const amount = req.body.amount
    const num = 123456789
    const userId = user._id
    const categoryId = req.body.category
    await Record.create({ name, date, amount, userId, categoryId })
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id/edit', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const record = await Record.findById(id)
    await record.remove()
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router