$(document).ready(async () => {
  const courseId = localStorage.getItem("courseId");
  const response = await fetch(
    "https://qcfirst-backend.herokuapp.com/api/course/get-student-roster",
    {
      method: "post",
      body: JSON.stringify({ courseId }),
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((resp) => resp.json())
    .then((data) => {
      if (data.message != undefined) {
        alert(data.message);
      } else {
        console.log(data[0]);
        let markup = "";
        if ($("#studentList").children().length != 0) {
          $("#studentList").empty();
        }
        if (data[0].students.length != 0) {
          data[0].students.map((student) => {
            markup = `<tr>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.email}</td>`;
            $("#studentList").append(markup);
          });
        } else {
          $("#studentList").append(
            "<td colspan='3'><h3>No students to show<h3></td>"
          );
        }
      }
    })
    .catch((err) => {
      alert(err);
    });
  localStorage.removeItem("courseId");
});
