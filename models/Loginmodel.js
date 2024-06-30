const mongoose=require('mongoose')
const LoginSchema = mongoose.Schema({
    firstname: {
        type:String,
        required:true,
        },
    lastname: {
        type:String,
       
        },
    dob:{
        type: String,
        require: true,
        default: Date.now
    },
    password:{
        type:String,
        required:true,

    },
    date:{
        type:Date,
        default: Date.now,
        required:true

    },
    mobile:{
        type:Number,
        max:10
    },
    email:{
        type:String,
        required:true,
        
        },
    business:{
        type:String
    },
    userprofile :{
            
            type: String
        },
    address:
    {
        type:String
    },
    pincode:{
        type:Number,
        max:6
    },
    newapi:{
    type:String,

    },
    stockapi:{
        type:String
    }

    
    
    

    
})
const User=mongoose.model('logininfo', LoginSchema)
module.exports= User
