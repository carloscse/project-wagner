const Connection = require('../models/connection');
const User = require('../models/user');

exports.getConnections = (req, res, next) => {
    // return array of existing connections
    Connection.find().then(foundConnections => {
        res.json({
            message: "All connections",
            connections: foundConnections
        });
    });
}

exports.getUserConnections = (req, res, next) => {
    Connection.find({ $or: [{sender: req.params.id}, {receiver: req.params.id}] })
    // Connection.aggregate([
    //     { 
    //         $lookup: {
    //             from: 'User',
    //             localField: 'sender',
    //             foreignField: 'account_number',
    //             as: 'userSend'
    //         }
    //     },
    // ])
    .then(foundConnections => {
        res.json({
            message: "All user connections",
            connections: foundConnections
        });
    });
}

exports.createConnection = (req, res, next) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const status = req.body.status;
        
    // create a new Connection instance
    const connection = new Connection({
        sender: sender,
        receiver: receiver,
        status: status,

    });

    // save the instance to the database
    connection.save()
    .then(connectionSaved => {
        res.status(201).json({
            message: 'Connection created successfully!',
            connection: {
                sender: sender,
                receiver: receiver,
                status: status,
            }
        });
    })
    .catch(err => console.log('err', err));
}

exports.createConnectionByAccount = (req, res, next) => {
    // create a new Connection instance
    const connection = new Connection({
        sender: req.body.sender,
        receiver: req.body.receiver,
        status: req.body.status,
    });
    connection.save()
    .then(connectionSaved => {
        res.status(201).json({
            message: 'Connection created successfully!',
            connection: {
                sender: req.body.sender,
                receiver: req.body.receiver,
                status: req.body.status,
            }
        });
    })
    .catch(err => console.log('err', err));
}

exports.updateConnection = (req, res, next) => {    
    // console.log(req.params.id)
    const connectionSaved = Connection.findOneAndUpdate({_id: req.params.id}, {
        sender: req.body.sender,
        receiver: req.body.receiver,
        status: req.body.status,
    },{new: true})
    .then(connectionSaved => {
        if(req.body.status == "Accepted"){
            const userSenderConnections = User.findByIdAndUpdate(req.body.sender, {$push: {connections: req.body.receiver}},
                { new: true, useFindAndModify: false })
                .then(senderConnections => {
                    console.log(senderConnections)
                })
            const userReceiverConnections = User.findByIdAndUpdate(req.body.receiver, {$push: {connections: req.body.sender}},
                { new: true, useFindAndModify: false })
                .then(receiverConnections => {
                    console.log(receiverConnections)
                })
        }
        else if(req.body.status == "Declined"){
            const userSenderConnections = User.findByIdAndUpdate(req.body.sender, {$pull: {connections: req.body.receiver}},
                { new: true, useFindAndModify: false })
                .then(senderConnections => {
                    console.log(senderConnections)
                })
            const userReceiverConnections = User.findByIdAndUpdate(req.body.receiver, {$pull: {connections: req.body.sender}},
                { new: true, useFindAndModify: false })
                .then(receiverConnections => {
                    console.log(receiverConnections)
                })
        }
        res.status(200).json({
            message: 'Connection updated successfully!',
            connection: {
                sender: connectionSaved.sender,
                receiver: connectionSaved.receiver,
                status: connectionSaved.status,
            }
        });
    })   
    .catch(err => console.log('err', err));
}

exports.deleteConnection = (req, res, next) => {
    Connection.findByIdAndDelete(req.params.id)
    .then((connection) => {
        if (!connection) {
            return res.status(404).send();
        }
        res.send(connection);
    }).catch((error) => {
        res.status(500).send(error);
    })
}