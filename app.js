const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017/wikiDB";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

//*******************REQUESTS TARGETING ALL ARTICLES**************//

app
  .route("/articles")

  .get((req, res) => {
    Article.find({}, (err, foundLists) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundLists);
      }
    });
  })

  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article");
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all the articles");
      }
    });
  });

//*******************REQUESTS TARGETING A SPECIFIC ARTICLE**************//

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, (err, foundList) => {
      if (err) {
        res.send(err);
      } else if (!foundList) {
        res.send("No article found");
      } else {
        res.send(foundList);
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { runValidators: true },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated document");
        }
      }
    );
  });

app.listen(PORT, () =>
  console.log(
    `--------------------------------------\nServer started on port ${PORT}`
  )
);
