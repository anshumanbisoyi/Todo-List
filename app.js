const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); //added to requirements



const app = express();
let items = [];
let workItems = [];
app.set('view engine', 'ejs'); //to be kept after the above code
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //to add styles.css we create a public folder and tell express to use this.
app.get("/", function(req, res) {

  let day = date.getDate(); //called here

  res.render("list", {
    listTitle: day,
    newListItems: items,
  });
}); //to set route for the home screen

app.post("/", function(req, res) {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
})
app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})
app.get("/about", function(req, res) {
  res.render("about");
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
