const express=require("express")
const morgan=require("morgan")
const helmet=require("helmet")
const mongoose=require("mongoose")
const UserRouter=require("./routes/users")
const AuthRouter=require("./routes/auth")
const postRoute=require("./routes/posts")
const router=express.Router()
const path=require("path")
const cors=require("cors")
const multer=require("multer")
const dotenv=require("dotenv")
const bcrypt=require("bcrypt")
const User = require("./models/User")
const Post = require("./models/Post")

const app=express()

dotenv.config();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // replace with your client origin
}));

mongoose.connect(
  "mongodb+srv://fb:fb@cluster0.imbxhmm.mongodb.net/"
  // { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// mongoose.connect('mongodb+srv://fb:fb@cluster0.imbxhmm.mongodb.net/',
// { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log("Connected to MongoDB");
//   }
// );
app.use("/images", express.static(path.join(__dirname, "public/images")));






//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });
 

//routes
app.use("/api/users",UserRouter)
app.use("/api/auth",AuthRouter)
app.use("/api/posts",postRoute)
// app.use("/api/search", async (req, res) => {
//   const query = req.query.q; // Get the search query from the request
//   try {
//     const users = await User.find({ $or: [{ username: new RegExp(query, 'i') }, { name: new RegExp(query, 'i') }] });
//     const posts = await Post.find({ content: new RegExp(query, 'i') });
//     res.status(200).json({ users, posts });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

app.listen(8888,()=>{
    console.log("server is running on port 8888")
})