const userModels=require('../models/UserModels')
const user = new userModels({
    email: "ram211296@gmail.com",
    profit_loss: "Profit",
    share: "apple",
    price: 88,
    time:"10:47am",
});

const save =()=>{
    userModels.insertMany([
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "idea",price: 1065,time:"10:47am",margin:56,
        },
        {
            email: "ram211296@gmail.com",profit_loss: "loss",share: "tata",price: 208.8,time:"10:48am",margin:-10
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "IBM",price: 120,time:"10:47am",margin:21.4
        },
        {
            email: "ram211296@gmail.com",profit_loss: "loss",share: "messho",price: 1005,time:"10:47am",
            margin:-5
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "apple",price: 4506,time:"10:47am",
            margin:489.
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "Abb",price: 4556,time:"10:47am",
            margin:23.6
        },
        {
            email: "ram211296@gmail.com",profit_loss: "loss",share: "apple",price: 4556,time:"10:47am",
            margin:40.7
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "tisco",price: 560,time:"10:47am",
            margin:40.7
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "abbbb",price: 4750,time:"10:47am",
            margin:-40.7
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "apptyu",price: 40,time:"10:47am",
            margin:4.9
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "al",price: 56,time:"10:47am",
            margin:-4
        },
        {
            email: "ram211296@gmail.com",profit_loss: "Profit",share: "apple",price: 4556,time:"10:47am",
            margin:67.6
        },
    ])
} 
module.exports=save

