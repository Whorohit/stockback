const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        max: 50
    },
    profit_loss: {
        type: String,
        max: 50
    },
    date: { type: Date, 
        default:
             Date.now }
    ,
    share: {
        type: String,
        require: true,

    },
    time: {
        type: String,
        require: true
    },
    price:{
        type:Number,
        require:true

    },
    margin:{
        type:Number,
        require:true
    }
})



const user=mongoose.model('users', userSchema)
module.exports=user