const mongoose = require('mongoose');

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        semester:String,
        courseName:String,
        department:String,
        addedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        students:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
        description:String,
        schedule:String,
        capacity:Number,
        deadline:String
    })
)

module.exports = Course