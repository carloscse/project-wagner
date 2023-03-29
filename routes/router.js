const express = require('express');
const authJwt = require("../controllers/auth");
const userController = require('../controllers/user');
const connectionController = require('../controllers/connection');
const transactionController = require('../controllers/transaction');

const router = express.Router();

const app = express();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// LOGIN ROUTES
router.post('/login', urlencodedParser, userController.login);

// USER ROUTES
router.get('/user/list', [authJwt.verifyToken], userController.getUsers);
router.get('/user/user/:id', [authJwt.verifyToken], userController.getUser);
router.post('/user/create', userController.createUser);
router.put('/user/update/:id', [authJwt.verifyToken], userController.updateUser);
// router.delete('user/delete/:id', [authJwt.verifyToken], userController.deleteUser);

// CONNECTION ROUTES
router.get('/connection/list', [authJwt.verifyToken], connectionController.getConnections);
router.get('/connection/user/:id', [authJwt.verifyToken], connectionController.getUserConnections);
router.post('/connection/create', [authJwt.verifyToken], connectionController.createConnection);
router.post('/connection/account', [authJwt.verifyToken], connectionController.createConnectionByAccount);
router.put('/connection/update/:id', [authJwt.verifyToken], connectionController.updateConnection);
router.delete('/connection/delete/:id', [authJwt.verifyToken], connectionController.deleteConnection);

// TRANSACTION ROUTES
router.get('/transaction/list', [authJwt.verifyToken], transactionController.getTransactions);
router.get('/transaction/user/:id', [authJwt.verifyToken], transactionController.getUserTransactions);
router.get('/transaction/sender/:id', [authJwt.verifyToken], transactionController.getUserSentTransactions);
router.get('/transaction/receiver/:id', [authJwt.verifyToken], transactionController.getUserReceivedTransactions);
router.get('/transaction/commissions/', [authJwt.verifyToken], transactionController.getBankCommissions);
router.post('/transaction/create', [authJwt.verifyToken], transactionController.createTransaction);
router.post('/transaction/account', [authJwt.verifyToken], transactionController.createTransactionByAccount);
router.put('/transaction/update/:id', [authJwt.verifyToken], transactionController.updateTransaction);
router.delete('/transaction/delete/:id', [authJwt.verifyToken], transactionController.deleteTransaction);

module.exports = router;