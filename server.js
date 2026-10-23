const express = require("express");
const sql = require("mssql");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình kết nối Azure SQL Database của bạn
const dbConfig = {
  user: "VanAnhAdmin",
  password: "Vananh0612@", // Điền mật khẩu database của bạn vào đây
  server: "qlsv-server-vananh0612.database.windows.net", // Lấy tên Server trên Azure portal của bạn
  database: "QLSV_DB",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

// API lấy danh sách sinh viên
app.get("/api/sinhvien", async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query("SELECT * FROM SinhVien");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// API thêm sinh viên mới
app.post("/api/sinhvien", async (req, res) => {
  try {
    const { MaSV, HoTen, NgaySinh, Lop, Email } = req.body;
    let pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("MaSV", sql.VarChar, MaSV)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("NgaySinh", sql.Date, NgaySinh)
      .input("Lop", sql.VarChar, Lop)
      .input("Email", sql.VarChar, Email)
      .query(
        "INSERT INTO SinhVien (MaSV, HoTen, NgaySinh, Lop, Email) VALUES (@MaSV, @HoTen, @NgaySinh, @Lop, @Email)",
      );
    res.json({ message: "Thêm thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
