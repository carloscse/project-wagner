const Transaction = require('../models/transaction');
const fs = require("fs");
// const { stringify } = require("csv-stringify");

exports.getTransactions = (req, res, next) => {
    // return array of existing transactions
    Transaction.find().then(foundTransactions => {
        res.json({
            message: "All transactions",
            transactions: foundTransactions
        });
    });
}

exports.getUserTransactions = (req, res, next) => {
    // return array of existing transactions
    Transaction.find({ $or: [{sender: req.params.id, is_undone: false}, {receiver: req.params.id, status: "Done"}] }).then(foundTransactions => {
        res.json({
            message: "All user transactions",
            transactions: foundTransactions
        });
    });
}

exports.getUserSentTransactions = (req, res, next) => {
    // return array of existing transactions
    Transaction.find({ sender: req.params.id }).then(foundTransactions => {
        res.json({
            message: "User sent transactions",
            transactions: foundTransactions
        });
    });
}

exports.getUserReceivedTransactions = (req, res, next) => {
    // return array of existing transactions
    Transaction.find({ receiver: req.params.id }).then(foundTransactions => {
        res.json({
            message: "User received transactions",
            transactions: foundTransactions
        });
    });
}

exports.getBankCommissions = (req, res, next) => {
    Transaction.aggregate([
        {
            $group: {
                _id: 0,
                // commission: { $sum: "$amount" }
                commission: { $sum: { $multiply: [ "$amount", "$commission" ] } }
            }
        },
    ]).then(foundTransactions => {
        res.json({
            message: "User received transactions",
            transactions: foundTransactions
        });
    });
}

exports.createTransaction = (req, res, next) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    const commission = req.body.commission;
    const status = req.body.status;
    const is_undone = req.body.is_undone;
        
    // create a new Transaction instance
    const transaction = new Transaction({
        sender: sender,
        receiver: receiver,
        amount: amount,
        commission: commission,
        status: status,
        is_undone: is_undone

    });

    // save the instance to the database
    transaction.save()
    .then(transactionSaved => {
        res.status(201).json({
            message: 'Transaction created successfully!',
            transaction: {
                sender: sender,
                receiver: receiver,
                amount: amount,
                commission: commission,
                status: status,
                is_undone: is_undone
            }
        });
    })
    .catch(err => console.log('err', err));
}

exports.createTransactionByAccount = (req, res, next) => {
    // create a new Transaction instance
    const transaction = new Transaction({
        sender: req.body.sender,
        receiver: req.body.receiver,
        amount: req.body.amount,
        commission: req.body.commission,
        status: req.body.status,
    });
    transaction.save()
    .then(transactionSaved => {
        console.log(transactionSaved)
        csvData = transactionSaved.sender + ',' + transactionSaved.receiver + ',' + transactionSaved.amount + ',' + transactionSaved.createdAt + '\r\n';
        fs.appendFile("transactions.csv", csvData, "utf-8", (err) => {
            if (err) console.log(err);
            else console.log("Data saved");
        });
        res.status(201).json({
            message: 'Transaction created successfully!',
            transaction: {
                sender: req.body.sender,
                receiver: req.body.receiver,
                status: req.body.status,
                amount: req.body.amount,
                commission: req.body.commission,
            }
        });
    })
    .catch(err => console.log('err', err));
}

exports.updateTransaction = (req, res, next) => {    
    const transactionSaved = Transaction.findOneAndUpdate({_id: req.params.id}, {
        sender: req.body.sender,
        receiver: req.body.receiver,
        amount: req.body.amount,
        commission: req.body.commission,
        status: req.body.status,
        is_undone: req.body.is_undone,
    },{new: true})
    .then(transactionSaved => {
        res.status(200).json({
            message: 'Transaction updated successfully!',
            transaction: {
                sender: transactionSaved.sender,
                receiver: transactionSaved.receiver,
                amount: transactionSaved.amount,
                commission: transactionSaved.commission,
                status: transactionSaved.status,
                is_undone: transactionSaved.is_undone,
            }
        });
    })   
    .catch(err => console.log('err', err));
}

exports.deleteTransaction = (req, res, next) => {
    Transaction.findByIdAndDelete(req.params.id)
    .then((transaction) => {
        if (!transaction) {
            return res.status(404).send();
        }
        res.send(transaction);
    }).catch((error) => {
        res.status(500).send(error);
    })
}