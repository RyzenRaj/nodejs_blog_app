import express from "express";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser"; 
const app = express();


app.use(express.json());
app.use(cookieParser()); 


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.listen(8000, () => {
    console.log("Server is connected and running on port 8000");
});
