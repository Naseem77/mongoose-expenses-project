const mongoose = require('mongoose')
const expenseData = require('../../expense-data.json')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    item: String,
    amount: Number,
    date: Date,
    group: String
})

const Expense = mongoose.model("expense", expenseSchema)

module.exports = Expense