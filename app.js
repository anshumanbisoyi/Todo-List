const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js"); //added to requirements
const _=require("lodash");
const app = express();
app.use(express.static("public/")); //to add styles.css we create a public folder and tell express to use this.
const url="mongodb+srv://admin-anshuman:test123@cluster0.dypbc9n.mongodb.net";


app.set('view engine', 'ejs'); //to be kept after the above code
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(url+"/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Hey get it done.",
});
const item2 = new Item({
  name: "Welcome todolist.",
});
const item3 = new Item({
  name: "Hit the gym",
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema] //array of item documents
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  let day = date.getDate(); //called here

  Item.find({}, function(err, foundItems) { //to read the data from the database

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) { //to save multiple data at once into the database
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully saved all items to todolistDB");
        }
      });
      res.redirect("/"); //cause it only saves and doesnt show that as in else part
    } else {
      res.render("partials/list.ejs", {
        listTitle: date.getDate(),
        newListItems: foundItems,
      });
    }
  });

}); //to set route for the home screen

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //console.log("Doesn't Exist."); //create a list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //console.log("Exists"); // show an existing list
        res.render("partials/list.ejs", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });



});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully deleted an item which is clicked.");
      }
      res.redirect("/");
    });
  } else {
List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
  if(!err){
    res.redirect("/"+listName);
  }
});
}
});

app.get("/work", function(req, res) {
  res.render("partials/list.ejs", {
    listTitle: "Work List",
    newListItems: workItems
  });
}) //app.get fetches the data stored in the server and renders it to the desired route page.
app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})
app.get("/about", function(req, res) {
  res.render("partials/about.ejs");
})
let port=process.env.PORT;
if(port == null || port ==""){
port=3000;
}
app.listen(port, function() {
console.log("Server has started!");
});
