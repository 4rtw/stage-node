require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const config = require("./Endpoints/GlobalConfig")
const exposeApprenant = require("./Endpoints/ApprenantEndpoints")
const exposeEnseignant = require("./Endpoints/EnseignantEndpoints")
const exposeFacturation = require("./Endpoints/FacturationEndpoints")
const exposeFrais = require("./Endpoints/FraisEndpoints")
const database = require("./Database/connection");
const app = express();
const port = process.env.APP_PORT || 4000;

mongoose.Promise = global.Promise;

database.connect();
config.globalConfig(app, express);

exposeEnseignant.apiEnseignant(app);
exposeApprenant.apiApprenants(app);
exposeFacturation.apiFacturation(app);
exposeFrais.apiFrais(app);

app.listen(port, "0.0.0.0");


module.exports = app;
