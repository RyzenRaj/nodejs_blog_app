import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import express from 'express';
const app = express();

app.use(express.json()); 





export const register = (req, res) => {

    const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) {
            return res.json(err);
        }
        if (data.length) {
            return res.status(409).json("User already exists");
        }

        if (!req.body.password) {
            return res.status(400).json("Password is required");
        }

        

        const salt = bcrypt.genSaltSync(10);
     
        const hash = bcrypt.hashSync(req.body.password, salt);
   

    
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ];


        db.query(insertQuery, values, (err, result) => {
            if (err) {  
                return res.json(err);
            }
            return res.status(200).json({ message: 'User has been created', affectedRows: result.affectedRows });

        });
    });
}



export const login = (req, res) => {
    //CHECK USER
  
    const q = "SELECT * FROM users WHERE username = ?";
  
    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
  
      //Check password
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json("Wrong username or password!");
  
      const token = jwt.sign({ id: data[0].id }, "jwtkey");
      const { password, ...other } = data[0];
  
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(other);
    });
  };


export const logout = (req, res) => {
    res.clearCookie("access_token",{
      sameSite:"none",
      secure:true
    }).status(200).json("User has been logged out.")
  };