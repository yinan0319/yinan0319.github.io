const express = require('express');
//const dbConfig = require('./app/config/db.config')
const db = require('./app/models');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const expSession = require('express-session');

const { response } = require('express');
// mongodb connection
db.mongoose.connect(`mongodb+srv://KTaibah:QCfirst@cluster0.gjjfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`successfuly connected to database`)
}).catch((err)=>{
    console.log(`Connection error : ${err}`)
    process.exit()
})

// cors setup
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


// session setup
app.use(expSession({
    name:'EMS-session',
    secret:`my-secret-session`,
    resave:true,
    saveUninitialized:true,
    cookie:{}
}))

// routes
require('./app/routes/user.route')(app);
require('./app/routes/course.route')(app);
// server setup
const PORT= process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})