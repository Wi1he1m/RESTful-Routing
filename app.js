var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    app     = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_routes");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Mongoose/Model CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    published: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     titel: "Springtime for Hitler",
//     image: "http://l7.alamy.com/zooms/e22d5764659a45159d3cb3a19cdaa1ef/les-producteurs-the-producers-anne-1968-usa-gene-wilder-zero-mostel-b7w396.jpg",
//     body: "The greatest Broadway Musical of ALL TIMES!!",
// }, function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Successful post!");
//     }
// });

//RESTful ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blog){
       if(err){
           console.log("Danger, Will Robinson!");
       } else {
           res.render("index", {blog: blog});
       }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");    
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newPost){
        if(err){
            console.log(err);
        } else {
            //redirect to index(for now)
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

// PUT ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blogUpdate){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    //Destroy Blog Post
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect("/blogs/" + req.params.id);
            } else {
        //Redirect
        res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("app is running... why don't you go catch it?");
});