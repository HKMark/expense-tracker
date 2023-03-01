const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const records = await Record.find({ userId }).lean()
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

module.exports = router