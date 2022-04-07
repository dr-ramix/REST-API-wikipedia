//adding all required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//creating new app with express web-framework
const app = express();


// use body parser to get data from HTTP
app.use(bodyParser.urlencoded({ extended: true}));

// match static files with dirctory public
app.use(express.static("public"))

app.set("view engine", "ejs");
//------------------------------------------------------------------------------------
// ***connecting to database and creating a Model*****
//connecting to local database
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Creating a schema for article collection, which has 2 fields
articleSchema = {
  title:String,
  content:String
}
//creating a model for articels(in database it is called collection)
const Article = mongoose.model("articel",articleSchema);

//------------------------------------------------------------------------------------
//**** REST API ****
///////////////////////////// Request targeting all articles >>>>>>>>>>>>>

/* chained Route Handlesrs Using Express:
 app.route("/articles").get().post().deldete()
 */
app.route("/articles")
//GET or Read / all aricles
.get(function(req,res){
  Article.find({},function(err,foundArticle){
    if(!err){
      res.send(foundArticle)
    }else {
      console.log(err);
    }
  });
})

//POST OR CREATE
.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.send("Succesfully added a new article.")
    }
  });
})

// delete all articles
.delete(function(req, res) {
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Succesfully deleted all articels")
    }else {
      console.log(err);
    }
  });
});

///////////////////////////// Request targeting a specific article >>>>>>>>>>>>>

app.route("/articles/:articleTitle")
.get(function(req, res){

  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else {
      res.send("No article is found")
    }
  })
})

//for updating database (in this case for updating an article)
//put update the whole entiry
.put(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true}, //by default Mongoose will prevent properties being overwritten and deleted.
    function(err){
      if(!err){
        res.send("Succesfully updated")
      }else {
        console.log(err);
      }
    });
})
// update a specific value of a specific documents
.patch(function(req, res){
  Article.updateOne(
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated")
      } else {
        console.log(err);
      }
    });
})
//delete a specific article or
.delete(function(req, res){
  Article.remove(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Succesfully deleted");
    } else{
      console.log(err);
    }
  })
});












//---------------------------------------------------------------------------------------------------
// make server on port 3000
app.listen(3000, function(req,res){
  console.log("server is running on port 3000!");
});
