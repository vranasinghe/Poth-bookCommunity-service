const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    //About to be developed

});

module.exports = mongoose.model('Shop', shopSchema);