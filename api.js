require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("./Endpoints/GlobalConfig");
const exposeApprenant = require("./Endpoints/ApprenantEndpoints");
const exposeEnseignant = require("./Endpoints/EnseignantEndpoints");
const exposeFacturation = require("./Endpoints/FacturationEndpoints");
const exposeFrais = require("./Endpoints/FraisEndpoints");
const exposeEnseignements = require("./Endpoints/EnseignementsEndpoints");
const database = require("./Database/connection");
const app = express();
const port = process.env.APP_PORT || 4000;

mongoose.Promise = global.Promise;

//Uncomment the following line in order to using local database
//database.connect();

//Test for online server
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://admin:M2DrtdZzOmSP3AohdmA123@database-mongo-stage.gl3gi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
//endtest

config.globalConfig(app, express);

exposeEnseignant.apiEnseignant(app);
exposeApprenant.apiApprenants(app);
exposeFacturation.apiFacturation(app);
exposeFrais.apiFrais(app);
exposeEnseignements.apiEnseignement(app);

app.listen(port, "0.0.0.0");

module.exports = app;
