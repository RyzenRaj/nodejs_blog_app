import db from '../db.js';
import jwt from 'jsonwebtoken';

export const getPosts = (req,res) =>{
    
    const q = req.query.cat ? "select * from posts where cat=?" : "select * from posts"; 
    db.query(q,[req.query.cat], (err,data)=>{
        if(err) return res.send(err)

        return res.status(200).json(data)    
    })
} 






export const getSinglePost = (req, res) => {
    const postUid = req.query.uid;      
    const userId = req.params.id;   

    if (!postUid || !userId) {
        return res.status(400).json({ error: "Missing 'uid' or 'id' parameter" });
    }

    const query = `
        SELECT posts.id, posts.title, posts.description, posts.image, posts.uid, posts.cat 
        FROM posts 
        INNER JOIN users ON users.id = posts.uid
        WHERE posts.uid = ? AND users.id = ?;
    `;

    db.query(query, [postUid, userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Database query error" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(results[0]);
    });
};


export const addPost = (req, res) => {
    const { title, description, image, uid, cat } = req.body;

  
    if (!title || !description || !image || !uid || !cat) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    const query = `
        INSERT INTO posts (title, description, image, uid, cat)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.query(query, [title, description, image, uid, cat], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Database error while adding post" });
        }

        res.status(201).json({
            message: "Post added successfully",
            postId: results.insertId, 
        });
    });
};




export const deletePost = (req, res) => {

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");

        const postid = req.params.id;
        
        const q = "DELETE FROM POSTS WHERE `id` = ? AND `uid` = ?";

        console.log(userInfo.id, "this is logged-in user's uid");

        db.query(q, [postid, userInfo.id], (err, data) => {
            if (err) return res.status(500).json("Error deleting post");

            if (data.affectedRows === 0) {
                return res.status(403).json("You can only delete your own posts!");
            }

            return res.status(200).json("Post has been deleted");
        });
    });
};




export const updatePost = (req, res) => {
    const postId = parseInt(req.params.id, 10); 
    const { title, description, image, cat } = req.body; 
    if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
    }
    let updateFields = [];
    let queryParams = [];

    if (description) {
        updateFields.push('description = ?');
        queryParams.push(description);
    }
    if (title) {
        updateFields.push('title = ?');
        queryParams.push(title);
    }
    if (image) {
        updateFields.push('image = ?');
        queryParams.push(image);
    }
    if (cat) {
        updateFields.push('cat = ?');
        queryParams.push(cat);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: "Please provide at least one field to update" });
    }

 
    queryParams.push(postId);


    const query = `
        UPDATE posts
        SET ${updateFields.join(', ')}
        WHERE id = ?;
    `;

    db.query(query, queryParams, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error while updating post", details: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully" });
    });
};
