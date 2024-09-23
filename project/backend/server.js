const express = require("express");
const mysql = require('mysql');
const cors = require('cors');


const app = express ();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "172.16.72.43",
    user: "humbe",
    password: "tu_contraseña",
    database: "project"

})


app.post('/singup', (req, res) => {
    const sql = "INSET INTO User ('email', 'password') VALUES (?_)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
        
    })
})


app.listen(8081, ()=>
{
    console.log("listening");
})