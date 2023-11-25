const {response}=require("express");
const express=require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
require("dotenv").config();

 const mongodbURL=process.env.MONGO_URL;
mongoose.connect(mongodbURL)
.then(()=>{
    console.log("Database connected succesfully");
})
.catch((err)=>{
    console.log("error occured at db connection",err);
});

const blogSchema=new mongoose.Schema({
    title:String,
    imageURL:String,
    description:String


});


const Blog=new mongoose.model("blog",blogSchema);

const blogPostArray=require("./data");


const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"))
app.get("/",(req,res)=>{
    Blog.find({})
    .then((arr)=>{
        res.render("index",{blogPostArray:arr});
    })
    .catch((err)=>{
        console.log("cannot find blogs");
        res.render("404");
    });
    //res.render("index",{blogPostArray:blogPostArray})
    
})
app.get("/about",(req,res)=>{
    res.render("about");

})

app.get("/contact",(req,res)=>{
    res.render("contact");

})

app.get("/compose",(req,res)=>{
    res.render("compose");


})
app.post("/compose",(req,res)=>{
    //const newId=blogPostArray.length+1;
    const image=req.body.imageUrl;
    const title=req.body.title;
    const description=req.body.description;
    
    const newBlog=new Blog({
        imageURL:image,
        title:title,
        description:description
    })
    newBlog.save()
    .then(()=>{
        console.log("Database connected succesfully");
    })
    .catch((err)=>{
        console.log("error posting new blog ");
    });
    // const obj={
    //     _id:newId,
    //     imageURL:image,
    //     title:title,
    //     description:description
    // }

    //blogPostArray.push(obj);
    res.redirect("/");
})
app.get("/post/:id",(req,res)=>{
    //console.log(req.params.id);
    const id=req.params.id;
    let title="";
    let imageURL="";
    let description="";
    blogPostArray.forEach(post =>{
        if(post._id == id){
            title=post.title;
            imageURL=post.imageURL;
            description=post.description;

        }

    });
    
    const post={
        title:title,
        imageURL:imageURL,
        description:description
    }
    res.render("post",{post:post})


})
// app.get("/",(request,response)=>{
//     response.send("welcome");
// })
// app.get("/contact",(req,res)=>{
//     res.send("This is contact page");
// })
const port=3000||process.env.PORT;
 app.listen(port,()=>{
    console.log("Server is listening on port 3000");
})



