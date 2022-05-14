require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable"); // will need for bonus in bdd
const mongoose = require("mongoose"); // will need for bonus
const cors = require("cors");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const axios = require("axios");

const app = express();
app.use(formidableMiddleware());
app.use(cors());

// mongoose.connect("mongodb://localhost/marvel-dev");
mongoose.connect(process.env.MONGODB_URI);

const Favorite = mongoose.model("Favorite", {
  newID: String,
  newName: String,
  type: String,
  image: { path: String, extension: String },
  description: String,
  comics: [],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", {
  userName: String,
  email: String,
  hash: String,
  salt: String,
  token: String,
});

const isAuthenticated = async (req, res, next) => {
  try {
    const checkUser = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (checkUser) {
      req.user = checkUser;
      return next();
    } else return res.status(400).json("Unauthorized");

    // req.user =
  } catch (error) {
    res.json(error);
  }
};

module.exports = isAuthenticated;

//GET all characters
app.get("/characters", async (req, res) => {
  try {
    const { limit, skip, name } = req.query;
    const reqQueries = `&limit=${limit}&skip=${skip}&name=${name}`;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${reqQueries}`
    );
    //#region returns
    //   {
    //     "count": 1493,
    //     "limit": 100,
    //     "results": [
    //         {
    //             "thumbnail": {
    //                 "path": "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784",
    //                 "extension": "jpg"
    //             },
    //             "comics": [
    //                 "5fce213378edeb0017c9602f",
    //                 "5fce213478edeb0017c96040",
    //                 "5fce20fe78edeb0017c95fb7",
    //                 "5fce20e078edeb0017c95f01",
    //                 "5fce20ab78edeb0017c95e56",
    //                 "5fce207678edeb0017c95d8b",
    //                 "5fce207678edeb0017c95d8c",
    //                 "5fce202078edeb0017c95c8e",
    //                 "5fce292678edeb0017c97e05",
    //                 "5fce31ee78edeb0017c9a305",
    //                 "5fce31dc78edeb0017c9a2b0",
    //                 "5fce31c778edeb0017c9a276"
    //             ],
    //             "_id": "5fcf91f4d8a2480017b91453",
    //             "name": "3-D Man",
    //             "description": "",
    //             "__v": 0
    //         },
    //#endregion
    return res.json(response.data);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//GET 1 character
app.get("/character/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    //#region returns
    // {
    //   thumbnail: {
    //     path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/20/5232158de5b16',
    //     extension: 'jpg'
    //   },
    //   comics: [
    //     '5fce17e278edeb0017c93def',
    //     '5fce17ca78edeb0017c93da2',
    //     '5fce17c878edeb0017c93d62'
    //   ],
    //   _id: '5fcf91f4d8a2480017b91454',
    //   name: 'A-Bomb (HAS)',
    //   description: "Rick Jones has been Hulk's best bud since day one, but now he's more than a friend...he's a teammate! Transformed by a Gamma energy explosion, A-Bomb's thick, armored skin is just as strong and powerful as it is blue. And when he curls into action, he uses it like a giant bowling ball of destruction! ",
    //   __v: 0
    // }
    //#endregion
    return res.json(response.data);
  } catch (error) {
    return res.json(error);
  }
});

//GET all comics
app.get("/comics", async (req, res) => {
  try {
    const { limit, skip, title } = req.query;
    if (limit > 100) limit = 100;

    const reqQueries = `&limit=${limit}&skip=${skip}&title=${title}`;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${reqQueries}`
    );

    //#region returns
    //results : [
    // {
    //   thumbnail: [Object],
    //   _id: '5fce1ecc78edeb0017c9573a',
    //   title: '2009 Mini-Poster 6 (2009) #1',
    //   description: null,
    //   __v: 0
    // }, {}]
    //#endregion

    return res.json(response.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//GET comics associated with char id
app.get("/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${id}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    //#region returns
    // {
    //   thumbnail: {
    //     path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/20/5232158de5b16',
    //     extension: 'jpg'
    //   },
    //   comics: [
    //     '5fce17e278edeb0017c93def',
    //     '5fce17ca78edeb0017c93da2',
    //     '5fce17c878edeb0017c93d62'
    //   ],
    //   _id: '5fcf91f4d8a2480017b91454',
    //   name: 'A-Bomb (HAS)',
    //   description: "Rick Jones has been Hulk's best bud since day one, but now he's more than a friend...he's a teammate! Transformed by a Gamma energy explosion, A-Bomb's thick, armored skin is just as strong and powerful as it is blue. And when he curls into action, he uses it like a giant bowling ball of destruction! ",
    //   __v: 0
    // }
    //#endregion
    return res.json(response.data);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//Get favorites
app.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const response = await Favorite.find({ owner: req.user._id });

    return res.json(response);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//post Favorite
app.post("/favorites/modify", isAuthenticated, async (req, res) => {
  try {
    //type is either characters or comics.
    const { savedId, newName, type, image, description, comics } = req.fields;

    const response = await Favorite.findOne({ newID: savedId });
    if (response === null) {
      const newFav = await new Favorite({
        newID: savedId,
        newName: newName,
        type: type,
        image: image,
        description: description,
        comics: comics,
      });

      newFav.owner = req.user._id;
      await newFav.populate("owner");

      await newFav.save();
      return res.json("added");
    } else {
      await Favorite.deleteOne({ newID: savedId });
      return res.json("removed");
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.fields;

    const checkNewUser = await User.findOne({ email: email });
    if (checkNewUser) return res.status(409).json("user already exists");

    const salt = uid2(16);

    const token = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);

    const newUser = await new User({
      userName: userName,
      email: email,
      hash: hash,
      salt: salt,
      token: token,
    });

    await newUser.save();

    return res.json({
      token: token,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.fields;

    const findUser = await User.findOne({ email: email });
    if (!findUser) return res.status(404).json("user does not exist");

    const checkPwd =
      SHA256(password + findUser.salt).toString(encBase64) === findUser.hash
        ? true
        : false;

    if (checkPwd) {
      const token = uid2(16);
      findUser.token = token;

      await findUser.save();
      return res.json({ token: token });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
