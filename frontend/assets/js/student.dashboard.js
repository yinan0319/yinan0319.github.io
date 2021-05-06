const enroll = async (courseId) => {
  const studentId = localStorage.getItem("userId");
  console.log(studentId);
  if (confirm("Do you want to enroll in this course?")) {
    const response = await fetch(
      "https://qcfirst-backend.herokuapp.com/api/course/enroll",
      {
        method: "post",
        body: JSON.stringify({ courseId, studentId }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message != undefined) {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  } else {
    // Do nothing!
  }
};

const searchCourse = async () => {
  const courseName = $("#courseName").val();
  const department = $("#ddnDepartment").val();
  const semester = $("#ddnSemester").val();
  if (!courseName || !department || !semester) {
    alert("Please fill all the feilds");
  } else {
    const response = await fetch(
      "https://qcfirst-backend.herokuapp.com/api/course/search",
      {
        method: "post",
        body: JSON.stringify({ courseName, department, semester }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        let markup = "";
        const course = data[0];
        if ($("#courseList").children().length != 0) {
          $("#courseList").empty();
        }
        console.log(data);
        if (data.length != 0) {
          markup = `<tr>
                    <td>${course.courseName}</td>
                    <td>${course.semester}</td>
                    <td>${course.department}</td>
                    <td>${course.capacity}</td>
                    <td>${course.schedule}</td>
                    <td>${course.students.length}</td>
                    <td><button class="primary-btn" onclick="enroll('${course._id}')">Enroll</button></td>
                    </tr>`;
          $("#courseList").append(markup);
        } else {
          $("#courseList").append(
            "<tr><td colspan='8'><h3>No Course found. Please enter correct data</h3></td></tr>"
          );
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
};
