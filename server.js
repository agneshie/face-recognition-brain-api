const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const signin = require("./contollers/sigin");
const register = require("./contollers/register");
const profile = require("./contollers/profile");
const image = require("./contollers/image");


const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_HOST,
    port : 5432,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASS,
    database : process.env.DATABASE_NAME
  }
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => { res.json("Success")});

app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt)});

app.get("/profile/:id", (req, res) => { profile.handleProfileGet(req, res, db)});

app.put("/image", (req, res) => { image.handleImage(req, res, db)});

app.post("/imageurl", (req, res) => { image.handleApiCall(req, res)});


app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

