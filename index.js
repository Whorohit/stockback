const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const userModels=require('./models/UserModels')
const loginAuth=require("./models/Loginmodel")
const userledger=require("./models/userledger")
const Watchlist=require("./models/Watchlist")
const savenote=require('./UserController/UserController')
const app=express();
const routes=require('./Routes/loginAuth')
const routeold=require('./Routes/routes')
const routes2=require('./Routes/Notesauth')
const routes3=require('./Routes/watchlistauth')
const insertRandomData = require('./Routes/insertmany');
const errorMiddleware = require('./Middleware/error')
const { configDotenv } = require('dotenv')

configDotenv(
    {
        path: "./.env"
    }
)

const port = 5000
const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(
 corsOptions
));
app.use(express.json())
const mongodbsend=()=>{
    mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 1000000,
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
}
mongodbsend();

userModels();
loginAuth();
userledger();
Watchlist();
app.get("/",(req, res) => res.send("Express on Vercel"))

// savenote();
app.post('/auth/signup',routes)
app.post('/auth/login',routes)
app.get('/auth/getuser',routes)
app.post('/auth/pass',routes)
app.post('/auth/email',routes)
app.post('/auth/updateuserinfo',routes)
// legder request 
app.get('/api/data',routes2)
app.get('/api/graphdata',routes2)
app.get('/api/carddata',routes2)
app.get('/api/user',routeold)
app.get('/api/specificdata/:share',routes2)
app.post('/api/savedata',routes2)
app.post('/api/updatenote/:id',routes2)
app.get('/api/deletenote/:id',routes2)
// watchlist  request
app.post('/api/createwatchlist',routes3)
app.post('/api/addwatchlist',routes3)
app.post('/api/getwatchlist',routes3)
app.get('/api/getwatchlistnames',routes3)
app.post('/api/remove',routes3)
app.post('/api/deletewatchlist',routes3)


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)})
// app.post('/api/signup',routes)
