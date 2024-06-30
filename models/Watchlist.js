const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'logininfo'
    },
    share: {
        type: Array,
        required:true
    },
    watchlistname:{
        type:String,
        require:true
    }

    

})



const user=mongoose.model('Watchlist', userSchema)
module.exports=user