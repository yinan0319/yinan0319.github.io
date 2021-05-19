require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", (req, res) => {
  let data = req.body.url;
  let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  console.log(urlRegex.test(data));
  
  if (!urlRegex.test(data)) {
    res.json({ error: "invalid URL" });
  } else {
    Link.findOne({ link: data }, (err, doc) => {
      if (doc) {
        console.log("link found in db");
        res.json({
          original_url: data,
          short_url: doc._id
        });
      } else {
        console.log("link NOT found in db, adding new link");
        let id = makeid();
      
          let link = new Link({
            _id: id,
            link: data,
            created_at: new Date()
          });          
          link.save(err, doc => {
            if (err) return console.error("Error: ", err);
            console.log(doc);
            res.json({
              original_url: data,
              short_url: link._id
            });
          });
      }
    });
  }
});

app.get("/:id", (req, res) => {
  let id = req.params.id;
  Link.findOne({ _id: id }, (err, doc) => {
    if (doc) {
      res.redirect(doc.link);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/api/shorturl/new", (req, res) => {
  res.json({ hello: "hi there..." });
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
