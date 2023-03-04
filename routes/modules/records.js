const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// new record page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
})

// create new record
router.post('/', async (req, res) => {
  try {
    const { name, date, amount, categoryId } = req.body
    const userId = req.user._id
    await Record.create({ 
      name, 
      date, 
      amount, 
      userId, 
      categoryId
    })
    req.flash('success_msg', '成功新增支出！')
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

// edit record page
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const categories = await Category.find().lean()
    const record = await Record.findOne({ _id, userId }).lean()
    record.date = record.date.toISOString().slice(0, 10)
    const category = await Category.findOne({ _id: record.categoryId }).lean()
    const categoryName = category.name
    res.render('edit', { record, categoryName, categories })
  } catch (error) {
    console.log(error)
  }
})

// edit record 
router.put('/:id', async (req, res) => {
  try {
    const { name, date, amount, categoryId } = req.body
    const userId = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, userId })
    record.set({ name, date, amount, categoryId })
    await record.save()
    req.flash('success_msg', '編輯成功！')
    res.redirect(`/`)
  } catch (error) {
    console.log(error)
  }
})

// delete record
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, userId })
    await record.remove()
    req.flash('success_msg', '刪除成功！')
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router