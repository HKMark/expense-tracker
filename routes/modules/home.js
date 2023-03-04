const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await Category.find().lean()
    const records = await Record.find({ userId }).lean()
    const mappedRecords = await Promise.all(records.map(async (record) => {
      const categoryId = record.categoryId
      const category = await Category.findOne({ _id: categoryId }).lean()
      return {
        ...record,
        date: record.date.toISOString().slice(0, 10),
        icon: category.icon
      }
    }))
    const totalAmount = mappedRecords.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0).toFixed(2)
    res.render('index', { records: mappedRecords, totalAmount, categories })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router