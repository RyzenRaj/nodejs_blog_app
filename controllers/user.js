
import db from '../db.js';

export const getAllUsers = (req,res)=>{

    
    const getAllUser = "select id,username,email from users"

    db.query(getAllUser, (err, result)=>{
        if(err){
            return res.status(500).json({ message: "An error occurred while fetching users" });
        }
        return res.status(200).json(result)
    })
}   