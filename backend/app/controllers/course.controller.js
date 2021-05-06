const db = require('../models');
const Course = db.course;
const {isInArray} = require('../../utils/helpers')

const getCoursesbyId = (req,res)=>{
    Course.find({addedBy:req.body.instructorId})
    .lean()
    .exec((err,result)=>{
        if(err){
            res.status(500).send({message:err})
        }
        res.status(200).send({result})
    })
}
const createCourse=(req,res)=>{
    const course = new Course({
        semester:req.body.semester,
        courseName:req.body.courseName,
        department:req.body.department,
        addedBy:req.body.instructorId,
        description:req.body.description,
        schedule:req.body.schedule,
        capacity:req.body.capacity,
        deadline:req.body.deadline
    })
    course.save((err,course)=>{
        if(err){
            res.status(500).send({message:err})
        }
        res.status(200).send({message:"course added successfuly!"})
    })
}
const getStudentRoster=(req,res)=>{
    Course.find({_id:req.body.courseId})
    .populate("students")
    .select("students")
    .lean()
    .exec((err,result)=>{
        if(err){
            res.status(500).send({message:err})
        }
        res.status(200).send(result);
    })
}
const searchCourse=(req,res)=>{
    Course.find({
    courseName:req.body.courseName,
    department:req.body.department,
    semester:req.body.semester
    })
    .lean()
    .exec((err,result)=>{
        if(err){
            res.status(500).send({message:err});
        }
        res.status(200).send(result);
    })
}
const enrollCourse=(req,res)=>{
    Course.find({_id:req.body.courseId})
    .select("students capacity deadline")
    .lean()
    .exec((err,result)=>{
        if(err){
            res.status(500).send({message:err});
        }
        const {students,capacity,deadline}=result[0];
        if(students.length>=capacity){
            res.status(403).send({message:"Class capacity is already full"});
        }
        console.log(students)
        if(students.length != 0){
            if(isInArray(students,req.body.studentId)){
                res.status(403).send({message:"You are already enrolled"});
            }
            else{
                Course.findOneAndUpdate({_id:req.body.courseId},{$push:{students:req.body.studentId}},
                    (err,result)=>{
                        if(err){
                            res.status(500).send({message:err});
                        }
    
                        res.status(200).send({message:"You are enrolled successfully!"})
                    })
            }
        }
        else{
            Course.findOneAndUpdate({_id:req.body.courseId},{$push:{students:req.body.studentId}},
                (err,result)=>{
                    if(err){
                        res.status(500).send({message:err});
                    }

                    res.status(200).send({message:"You are enrolled successfully!"})
                }) 
        }
      
          
      
            
        
    })
}
const courseCont = {
    createCourse,
    searchCourse,
    enrollCourse,
    getStudentRoster,
    getCoursesbyId
}
module.exports =  courseCont