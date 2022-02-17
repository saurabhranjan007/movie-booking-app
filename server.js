const e = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
// Importing dotenv for accessing env variables
require("dotenv").config();

const app = express();

// app middlewars

app.use(cors());

// Using body parser middleware for json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");

  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Importing all routes
  require("./routes/movie.routes")(app);
  require("./routes/genre.routes")(app);
  require("./routes/artist.routes")(app);
  require("./routes/user.routes")(app);


// app.get("/movies" , (req, res) => {
//     res.status(200).json("All Movies Data in JSON format from Mongo DB");
// });

// app.get("/artists" , (req, res) => {
//     res.status(200).json("All Artists Data in JSON format from Mongo DB");
// });

// app.get("/genres" , (req, res) => {
//     res.status(200).json("All Genres Data in JSON format from Mongo DB");
// });

app.get("/", (req, res) => {
        res.status(200).json({message:  "Welcome to Upgrad Movie booking application development."});
    })


app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
