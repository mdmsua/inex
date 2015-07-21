'use strict';

let router = require('express').Router();
let currency = require('../modules/currency');
let i18n = require('../modules/i18n');
let account = require('../middleware/account');
let Account = require('../modules/account');
let Payment = require('../modules/payment');
let moment = require('moment');
let _ = require('underscore');

const categories = [
    {
      key: 'RNT',
      name: 'Rent',
      income: false
    },
    {
      key: 'NET',
      name: 'Internet',
      income: false
    },
    {
      key: 'PHN',
      name: 'Phone',
      income: false
    },
    {
      key: 'WTR',
      name: 'Water',
      income: false
    },
    {
      key: 'ELC',
      name: 'Electricity',
      income: false
    },
    {
      key: 'GRO',
      name: 'Groceries',
      income: false
    },
    {
      key: 'LUN',
      name: 'Lunch',
      income: false
    },
    {
      key: 'MED',
      name: 'Medicine',
      income: false
    },
    {
      key: 'TRX',
      name: 'Transfer',
      income: false
    },
    {
      key: 'INC',
      name: 'Salary',
      income: true
    }
];

const datetime = 'YYYY-MM-DDTHH:mm';

let get = (req, res) => {
  res.render('account/create',
      {title: 'Create account', currencies: currency.list});
};

let post = (req, res) => {
  let account = req.body;
  account.user = req.user._id;
  account.created = new Date();
  account.amount = Number.parseFloat(account.amount);
  Account.create(account)
      .then(res.redirect('/dashboard'))
        .catch(error => res.render('account/create', {
          title: 'Create account',
          currencies: currency.list,
          error: error.message,
          model: req.body
        }));
};

let payments = (req, res) => {
  let account = req.params.account;
  let user = req.user._id;
  let currencyFormatter = i18n.currencyFormatter(req.account.currency);
  let dateFormatter = i18n.dateFormatter({datetime: 'full'});
  Account.findOne({_id: account, user: user})
      .select('payments').sort({'payments.date': -1})
        .then(data => {
          let payments = data.payments.map(value => {
            value.formattedAmount = currencyFormatter(value.amount);
            value.formattedDate = dateFormatter(value.date);
            value.category =
                _.findWhere(categories, {key: value.category}).name;
            return value;
          });
          return res.render('account/payments', {
            title: 'Payments', payments: payments
          });
        });
};

let income = (req, res) => {
  res.render('account/payment', {
    title: 'New income',
    categories: categories.filter(c => c.income),
    model: {date: moment().format(datetime)},
    min: 1,
    max: Number.MAX_VALUE
  });
};

let expense = (req, res) => {
  res.render('account/payment', {
    title: 'New expense',
    categories: categories.filter(c => !c.income),
    model: {date: moment().format(datetime)},
    targets: req.session.accounts
        .filter(account => account._id.toString() !==
    req.account._id.toString())
        .map(function(account) {
          return {
            id: account._id,
            name: account.name
          }
        }),
    min
:
1,
    max
:
req.account.amount
  }
  )
  ;
}
;

let postIncome = (req, res) => {
  let payment = new Payment(req.body);
  payment.amount = Math.abs(payment.amount);
  Account.findByIdAndUpdate(req.account, {
    $push: {payments: payment},
    $inc: {amount: payment.amount}
  }).then(() => res.redirect('/dashboard'));
};

let handleTransfer = function(account, body) {
  let source = new Payment(body);
  let destination = new Payment(body);
  source.amount = -Math.abs(body.amount);
  destination.amount = Math.abs(body.amount);
  destination.account = account;
  return new Promise((resolve, reject) => Account.collection.bulkWrite([
        {
          updateOne: {
            filter: {_id: account},
            update: {
              $push: {payments: source},
              $inc: {amount: source.amount}
            }
          }
        },
        {
          updateOne: {
            filter: {_id: body.account},
            update: {
              $push: {payments: destination},
              $inc: {amount: destination.amount}
            }
          }
        }
    ], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }));
};

let handlePayment = function(account, body) {
  let payment = new Payment(body);
  payment.amount = -Math.abs(payment.amount);
  return Account.findByIdAndUpdate(account, {
    $push: {payments: payment},
    $inc: {amount: payment.amount}
  });
};

let postExpense = (req, res) => {
  let body = req.body;
  if (body.category === 'TRX') {
    handleTransfer(req.account, body).then(() => res.redirect('/dashboard'));
  } else {
    handlePayment(req.account, body).then(() => res.redirect('/dashboard'));
  }
};

router.get('/create', get);
router.post('/create', post);
router.get('/:account(\\w{24})', account, payments);
router.get('/:account(\\w{24})/\\+', account, income);
router.get('/:account(\\w{24})/-', account, expense);
router.post('/:account(\\w{24})/\\+', account, postIncome);
router.post('/:account(\\w{24})/-', account, postExpense);

module.exports = router;
