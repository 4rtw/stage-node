const express = require("express");
const mongoose = require("mongoose");
const apprenant = require("./Routes/ApprenantsRoutes");
const enseignant = require("./Routes/EnseignantsRoutes");
const fraisScolarite = require("./Routes/PayementFraisRoutes");
const MSG = require("./Messages/messages");
const apiResponse = require("./Models/apiResponse");
const variables = require("./Database/variables");
const app = express();
const port = process.env.PORT || 3000;
const prefix = "/api";
mongoose.Promise = global.Promise;

/*---------------------------------------------------------------------------------------*/
/*Connect to database
/*---------------------------------------------------------------------------------------*/
mongoose.connect(variables.uri, variables.options).then(() => {
  console.log("Connected to MongoDB");
});
/*---------------------------------------------------------------------------------------*/
// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  next();
});

/*---------------------------------------------------------------------------------------*/
// Pour les formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    return res.status(400).json(
      apiResponse({
        data: [],
        status: 0,
        errors: [MSG.HTTP_400],
        message: "",
      })
    );
  } else {
    next();
  }
});
/*---------------------------------------------------------------------------------------*/
//api enseignants
app.route(prefix + "/enseignants").get(enseignant.getEnseignants);

app
  .route(prefix + "/enseignant/:id")
  .get(enseignant.getEnseignant)
  .delete(enseignant.deleteEnseignant);

app.route(prefix + "/enseignants/search").get(enseignant.searchEnseignants);

app
  .route(prefix + "/enseignant")
  .post(enseignant.postEnseignant)
  .put(enseignant.updateEnseignant);

/*---------------------------------------*/

//api apprenant
app.route(prefix + "/apprenants").get(apprenant.getApprenants);

app.route(prefix + "/apprenants/search").get(apprenant.searchApprenants);

app
  .route(prefix + "/apprenant/:id")
  .get(apprenant.getApprenant)
  .delete(apprenant.deleteApprenant);

app
  .route(prefix + "/apprenant")
  .post(apprenant.postApprenant)
  .put(apprenant.updateApprenant);

/*---------------------------------------*/

//api payement frais
app
  .route(prefix + "/frais-scolarite")
  .get(fraisScolarite.getPayementsFraisByPeriodeAndInsciption);

app
  .route(prefix + "/frais-scolarite/:id")
  .get(fraisScolarite.getPayementFrais)
  .delete(fraisScolarite.deletePayementFrais);

app.route(prefix + "/frais-scolarite").post(fraisScolarite.postPayementFrais);

/*---------------------------------------------------------------------------------------*/
app.listen(port, "0.0.0.0");
/*---------------------------------------------------------------------------------------*/

module.exports = app;
