require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable"); // will need for bonus in bdd
const mongoose = require("mongoose"); // will need for bonus
const cors = require("cors");

const axios = require("axios");

const app = express();
app.use(formidableMiddleware());
app.use(cors());

// mongoose.connect("mongodb://localhost:3000/marvel-dev"); // will need for bonus

// const CHARACTER = mongoose.model("Characters", {
//   docName: String,
//   num: Number,
//   // si ref author: {type: mongoose.Schema.Types.ObjectId, ref: "NOMCOLLECTION"}
// });

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

    console.log(response.data);

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

app.all("*", (req, res) => {
  res.status(404).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
