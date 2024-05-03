const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "employee_data",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Terhubung ke database MySQL");
});

app.post("/employees", (req, res) => {
  const { firstName, lastName, age, profileImage } = req.body;

  db.query(
    "INSERT INTO employees (firstName, lastName, age, profileImage) VALUES (?, ?, ?, ?)",
    [firstName, lastName, age, profileImage],
    (err, results) => {
      if (err) {
        console.error("Error menambah data karyawan:", err);
        res.status(500).send("Gagal menambah data karyawan");
        return;
      }
      console.log("Data karyawan berhasil ditambahkan");
      res.status(200).send("Data karyawan berhasil ditambahkan");
    }
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.error("Error mengambil data karyawan:", err);
      res.status(500).send("Gagal mengambil data karyawan");
      return;
    }
    console.log("Data karyawan berhasil diambil");
    res.status(200).json(results);
  });
});

app.get("/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  db.query(
    "SELECT * FROM employees WHERE id = ?",
    [employeeId],
    (err, results) => {
      if (err) {
        console.error("Error mengambil data karyawan:", err);
        res.status(500).send("Gagal mengambil data karyawan");
        return;
      }
      if (results.length === 0) {
        res.status(404).send("Karyawan tidak ditemukan");
        return;
      }
      console.log("Data karyawan berhasil diambil");
      res.status(200).json(results[0]);
    }
  );
});

app.delete("/employees/:id", (req, res) => {
  const employeeId = req.params.id;

  db.query(
    "DELETE FROM employees WHERE id = ?",
    [employeeId],
    (err, results) => {
      if (err) {
        console.error("Error menghapus data karyawan:", err);
        res.status(500).send("Gagal menghapus data karyawan");
        return;
      }
      console.log("Data karyawan berhasil dihapus");
      res.status(200).send("Data karyawan berhasil dihapus");
    }
  );
});

app.put("/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  const { firstName, lastName, age } = req.body;

  db.query(
    "UPDATE employees SET firstName = ?, lastName = ?, age = ? WHERE id = ?",
    [firstName, lastName, age, employeeId],
    (err, results) => {
      if (err) {
        console.error("Error memperbarui data karyawan:", err);
        res.status(500).send("Gagal memperbarui data karyawan");
        return;
      }
      console.log("Data karyawan berhasil diperbarui");
      res.status(200).send("Data karyawan berhasil diperbarui");
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
