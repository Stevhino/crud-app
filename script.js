const addEmployeeForm = document.getElementById("addEmployeeForm");
const tableBody = document.getElementById("tbody-employee");

const apiURL = "https://662b690ade35f91de15829b1.mockapi.io/api/v1/employee/";

function displayData(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">Tidak Ada Data</td></tr>`;
  } else {
    data.forEach((item) => {
      let row = `<tr>
                    <td>${item.id}</td>
                    <td>${item.firstName}</td>
                    <td>${item.lastName}</td>
                    <td>${item.age}</td>
                    <td><img class="img-thumbnail" src="${item.profileImage}" alt="_blank" /></td>
                    <td><button class="btn btn-primary rounded-0 btn-edit input-pointer" data-id="${item.id}">Edit</button></td>
                    <td><button class="btn btn-danger rounded-0 btn-delete input-pointer" data-id="${item.id}">Delete</button></td>
                </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  }
}
function addEmployee(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = document.getElementById("age").value;
  const profileImage = document.getElementById("profileImage").files[0];

  const formData = {
    firstName: firstName,
    lastName: lastName,
    age: age,
    profileImage: profileImage,
  };

  axios
    .post(apiURL, JSON.stringify(formData), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Data sukses ditambah:", response.data);
      fetchData();
      addEmployeeForm.reset();
    })
    .catch((error) => {
      console.error("Error menambah data:", error);
    });
}

function deleteEmployee(employeeId) {
  axios
    .delete(`${apiURL}/${employeeId}`)
    .then((response) => {
      console.log("Data berhasil dihapus", response.data);
      fetchData();
    })
    .catch((error) => {
      console.error("Error menghapus data:", error);
    });
}

function updateEmployee(employeeId) {
  const editedFirstName = document.getElementById("editFirstName").value;
  const editedLastName = document.getElementById("editLastName").value;
  const editedAge = document.getElementById("editAge").value;
  console.log(employeeId, editedFirstName, editedLastName, editedAge);

  const updatedData = {
    firstName: editedFirstName,
    lastName: editedLastName,
    age: editedAge,
  };

  axios
    .put(`${apiURL}/${employeeId}`, JSON.stringify(updatedData), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Data Berhasil diUbah", response.data);
      fetchData();
      const editModal = document.getElementById("editEmployeeModal");
      editModal.style.display = "none";
    })
    .catch((error) => {
      console.error("Error mengubah data:", error);
    });
}

function handleDeleteButton(e) {
  if (e.target.classList.contains("btn-delete")) {
    const row = e.target.closest("tr");
    const employeeId = e.target.dataset.id;

    deleteEmployee(employeeId);
  }
}

function handleEditButton(e) {
  if (e.target.classList.contains("btn-edit")) {
    const employeeId = e.target.dataset.id;
    console.log(employeeId);

    showEditModal(employeeId);
  }
}

function handleUpdateButton() {
  const employeeId = this.dataset.id;
  updateEmployee(employeeId);
}

function showEditModal(employeeId) {
  axios
    .get(`${apiURL}/${employeeId}`)
    .then((response) => {
      const employeeData = response.data;
      document.getElementById("editFirstName").value = employeeData.firstName;
      document.getElementById("editLastName").value = employeeData.lastName;
      document.getElementById("editAge").value = employeeData.age;

      const editModal = document.getElementById("editEmployeeModal");
      editModal.style.display = "block";

      const closeButton = editModal.querySelector(".btn-close");
      closeButton.addEventListener("click", () => {
        editModal.style.display = "none";
      });

      const saveChangesButton = document.getElementById("editSubmit");
      saveChangesButton.dataset.id = employeeId;
      saveChangesButton.addEventListener("click", handleUpdateButton);
    })
    .catch((error) => {
      console.error("Error mengambil data karyawan:", error);
    });
}

function fetchData() {
  axios
    .get(apiURL)
    .then((response) => {
      displayData(response.data);
    })
    .catch((error) => {
      console.error("Error mengambil data:", error);
    });
}

fetchData();

tableBody.addEventListener("click", handleDeleteButton);
tableBody.addEventListener("click", handleEditButton);
addEmployeeForm.addEventListener("submit", addEmployee);
