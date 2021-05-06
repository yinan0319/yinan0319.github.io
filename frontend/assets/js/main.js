const togglemenu = () => {
  $("#toggleMenu").toggleClass("active");
};
const logout = () => {
  if (confirm("Do you want to logout?")) {
    localStorage.removeItem("userId");
    window.location.replace("index.html");
  } else {
    // Do nothing!
  }
};

const addCourse = async () => {
  const courseName = $("#courseName").val();
  const semester = $("#ddnSemester :selected").val();
  const department = $("#ddnDepartment :selected").val();
  const startTime = $("#startTime").val();
  const endTime = $("#endTime").val();
  const schedule = `${startTime} - ${endTime}`;
  const capacity = $("#capacity").val();
  const deadline = $("#deadline").val();
  const description = $("#description").val();
  const instructorId = localStorage.getItem("userId");
  if (
    !courseName ||
    !semester ||
    !department ||
    !startTime ||
    !endTime ||
    !capacity ||
    !deadline ||
    !description
  ) {
    alert("Please enter all the feilds");
  } else {
    const response = await fetch(
      "https://qcfirst-backend.herokuapp.com/api/course/create",
      {
        method: "post",
        body: JSON.stringify({
          courseName,
          semester,
          department,
          schedule,
          capacity,
          deadline,
          description,
          instructorId,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((err) => {
        alert(err);
      });
  }
};

const ROLE = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
};

const login = async () => {
  const email = $("#email").val();
  const password = $("#password").val();
  if (!email || !password) {
    alert("email or password empty");
  } else {
    const response = await fetch(
      "https://qcfirst-backend.herokuapp.com/api/user/login",
      {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message != undefined) {
          alert(data.message);
        } else {
          localStorage.setItem("userId", data.user._id);
          if (data.user.role == ROLE.INSTRUCTOR) {
            window.location.replace("instructor-homepage.html");
          }
          if (data.user.role == ROLE.STUDENT) {
            window.location.replace("student-homepage.html");
          }
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
};
const register = async () => {
  const role = $("#radioDiv input[type='radio']:checked").val();
  const email = $("#email").val();
  const firstname = $("#first-name").val();
  const lastname = $("#last-name").val();
  const password = $("#password").val();
  const cPassword = $("#c-password").val();
  if (!role || !firstname || !lastname || !email || !password || !cPassword) {
    alert("Please fill all the feilds");
  } else {
    if (password == cPassword) {
      if (validateEmail(email)) {
        if (validatePassword(password)) {
          const response = await fetch(
            "https://qcfirst-backend.herokuapp.com/api/user/signup",
            {
              method: "post",
              body: JSON.stringify({
                firstname,
                lastname,
                email,
                password,
                role,
              }),
              headers: { "Content-Type": "application/json" },
            }
          )
            .then((resp) => resp.json())
            .then((data) => {
              alert(data.message);
              document.location.replace("index.html");
            })
            .catch((err) => {
              alert(err);
            });
        } else {
        }
      } else {
        alert("Please enter a valid email e.g admin@domain.com");
      }
    } else {
      alert("Password mismatch!");
    }
  }
};

// validate email in shape of "user@domain.com"
const validateEmail = (email) => {
  const validRegex = new RegExp(
    "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)"
  );
  return validRegex.test(email);
};

// validate password in shape of "User0007"
const validatePassword = (password) => {
  const lowerCase = new RegExp("[a-z]");
  const upperCase = new RegExp("[A-Z]");
  const digits = new RegExp("[0-9]");

  if (password.length >= 8) {
    if (lowerCase.test(password)) {
      if (upperCase.test(password)) {
        if (digits.test(password)) {
          return true;
        } else {
          alert("Password must contain a digit.");
          return false;
        }
      } else {
        alert("Password must contain an uppercase letter.");
        return false;
      }
    } else {
      alert("Password must contain a lowercase letter.");
      return false;
    }
  } else {
    alert("Password must be of length 8.");
    return false;
  }
};
