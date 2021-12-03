const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    cryptoCoin: {
        type: String
    },
    price: {
        type: String
    },
    criticalValuePrice: {
        type: String
    },
    percentage: {
        type: String
    },
    criticalValuePercent: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)