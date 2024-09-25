const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "172.16.72.43",
    user: "humbe",
    password: "tu_contraseña",
    database: "project"
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database!");
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO User (email, name, lastname, password) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.email,
        req.body.name,
        req.body.lastname,
        req.body.password
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.status(201).json({ message: "User created", data: data });
    });
});

app.listen(8081, () => {
    console.log("Server listening on port 8081");
});
