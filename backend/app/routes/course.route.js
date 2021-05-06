const {courseCont} = require('../controllers');
const {signupHelpers} = require('../middlewares')
module.exports = function(app){
    app.use(function(res,req,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
    
    app.post('/api/course/create',[courseCont.createCourse]);
    app.post('/api/course/search',[courseCont.searchCourse]);
    app.post('/api/course/enroll',[courseCont.enrollCourse]);
    app.post('/api/course/get-student-roster',[courseCont.getStudentRoster]);
    app.post('/api/course/getcourses',[courseCont.getCoursesbyId]);
}