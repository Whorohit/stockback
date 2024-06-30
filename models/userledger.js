const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'logininfo'
    },
    profit_loss: {
        type: String,
        max: 50
    },
    date: { type: String,
        require: true,
        default: Date.now}
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
    },
    quantity:{
        type:Number,
        require:true,
        default:1
    },
    action:
    {
        type:String,
        require:true,
        
    }

})



const user=mongoose.model('userledger', userSchema)
module.exports=user