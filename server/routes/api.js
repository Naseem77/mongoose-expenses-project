const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../models/Expense')
// Expense.forEach(e => {
//     new Expense({
//         item: e.item,
//         amount: e.amount,
//         date: e.date,
//         group: e.group
//     }).save()
// })

// Expense.find({}, function (err, people) {
//     console.log(people)
// })

router.get('/expenses', function (req, res) {
   const d1 = req.query.d1;
  const d2 = req.query.d2;
  if (d1 != undefined && d2 != undefined) {
    Expense.find({
      date: { $lt: moment(d2).format("LLLL"), $gt: moment(d1).format("LLLL") },
    })
      .sort({ date: -1 })
      .exec(function (err, expenses) {
        res.send(expenses);
      });
  } else if (d1 != undefined) {
    Expense.find({
      date: { $gt: moment(d1).format("LLLL"), $lt: moment().format("LLLL") },
    })
      .sort({ date: -1 })
      .exec(function (err, expenses) {
        res.send(expenses);
      });
  } else {
    Expense.find({})
      .sort({ date: -1 })
      .exec(function (err, expenses) {
        res.send(expenses);
      });
  }
})

router.post('/expense', function (req, res) {
    const expense = req.body;
    const newExpense = new Expense({
        item: expense.item,
        amount: expense.amount,
        group: expense.group,
  });
    const date = expense.date
    ? moment(expense.date).format("LLLL")
    : moment(new Date()).format("LLLL");

    newExpense.date = date;
    newExpense.save();
    res.send(newExpense);
})

router.put("/update/:group1&:group2", async function (req, res) {
  const group1 = req.params.group1;
  const group2 = req.params.group2;

  const updated = await Expense.findOneAndUpdate(
    { group: group1 },
    { group: group2 },
    { new: true }
  );
  res.send(updated);
});

router.get("/expenses/:group", function (req, res) {
  const groupCategory = req.params.group;
  const total = req.query.total;

  if (!total) {
    Expense.find({ group: groupCategory }, function (err, expenses) {
      res.send(expenses);
    });
  } else {
    Expense.aggregate(
      [
        { $match: { group: groupCategory } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ],
      function (err, expenses) {
        res.send(expenses);
      }
    );
  }
});
module.exports = router
