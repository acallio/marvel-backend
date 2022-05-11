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

const CHARACTER = mongoose.model("Characters", {
  docName: String,
  num: Number,
  // si ref author: {type: mongoose.Schema.Types.ObjectId, ref: "NOMCOLLECTION"}
});

app.get("/characters", async (req, res) => {
  try {
    const { limit, skip, name } = req.query;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}`
    );

    console.log(response.data);
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

app.all("*", (req, res) => {
  res.status(404).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
