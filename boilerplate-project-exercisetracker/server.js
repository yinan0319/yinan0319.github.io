const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://yinan0319:19960319@cluster0.lgn2m.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });

const Excs = mongoose.Schema({
  description:{type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});
const UseS = mongoose.Schema({
  username:{type: String, required: true},
  log: [Excs]
});
let User = new  mongoose.model('Uses', UseS);
let Scs = new mongoose.model('Scs', Excs);
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", function (req,res){
  let newUser = new User({username: req.body.username});
  newUser.save();
  return res.json({'username': newUser.username, '_id': newUser.id}) 
})
app.get("/api/users", function (req, res){
  User.find({}, function(err, data){ 
    res.json(data);
  })
})
app.post("/api/users/:_id/exercises", function(req, res){
  let newE = new Scs({description: req.body.description, 
  duration: req.body.duration,
  date: req.body.date 
  })
  if(!newE.date){newE.date = new Date().toISOString().substring(0,10);}
  newE.save();
  let y = User.findByIdAndUpdate(req.params._id,
      {$push: {log: newE}},
      {new: true},function(err, data){
        let x = {}
        x["username"] = data.username
        x["description"] = req.body.description
        x["duration"] = newE.duration
        x["_id"] = data._id
        x["date"] = new Date(newE.date).toDateString(); 
        res.json(x);
      })
})
app.get("/api/users/:_id/logs", function(req,res){
  
  let y = User.findById(req.params._id, function(err, data){
      let x = {}
      x["_id"] = data._id
      x["username"] = data.username
      end = req.query.to ? new Date(req.query.to) : new Date();
      start = req.query.from ? new Date(req.query.from) : new Date(0);
      data.log = data.log.filter((item) =>{
        let x = new Date(item.date).getTime();
        return x >= start && x <= end;
      })
      x["log"] = data.log.slice(0, req.query.limit);
      x["count"] = data.log.length;    
      res.json(x);    
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
