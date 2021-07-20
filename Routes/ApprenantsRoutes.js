require("dotenv").config();
const CryptoJS = require("crypto-js");
const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const apprenants = require("../Models/apprenants");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Utils/Validation");
const checkError = require("../Services/Utils/ErrorHandling");
const apprenantService = require("../Services/ApprenantService");

/*---------------------------------------------------------------------------------------------*/
//Lister les apprenants (GET)
function getApprenants(req, res) {
  const aggregateQuery = apprenants.aggregate([{ $unset: "password" }]);
  const pages = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  apprenantService.getPaginateApprenants(
    aggregateQuery,
    pages,
    res,
    (apprenants) => {
      console.log(`Obtention de tous les apprenants`);
      res.status(200).json(
        apiResponse({
          data: apprenants,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}
/*---------------------------------------------------------------------------------------------*/
//Rechercher les apprenants (GET)
function searchApprenants(req, res) {
  const searchString = req.query.searchString;
  const aggregateQuery = apprenants.aggregate([
    { $match: { $text: { $search: searchString } } },
    { $unset: "password" },
  ]);
  const pages = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  apprenantService.getPaginateApprenants(
    aggregateQuery,
    pages,
    res,
    (apprenants) => {
      console.log(`Obtention de tous les apprenants contenant ` + searchString);
      res.status(200).json(
        apiResponse({
          data: apprenants,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}
/*---------------------------------------------------------------------------------------------*/

//Recuperer un apprenant par son id (GET)
function getApprenant(req, res) {
  const condition = { matricule: req.params.id };

  apprenantService.getApprenant(condition, res, (apprenant) => {
    return res.status(200).json(
      apiResponse({
        data: apprenant,
        status: 1,
        errors: [],
        message: MSG.HTTP_200,
      })
    );
  });
}
/*---------------------------------------------------------------------------------------------*/

// Ajout d'un apprenant (POST)
function postApprenant(req, res) {
  const apprenant = new apprenants();
  const keys = [];

  for (const [key, value] of Object.entries(req.body)) {
    apprenant[key] = value;
    keys.push(key);
  }

  const encrypted = CryptoJS.AES.encrypt(
    req.body.matricule + req.body.anneeInscription,
    process.env.SALT_PASSWORD_APPRENANT
  );
  apprenant.password = encrypted;

  const manyErrors = validate(apprenant, keys);

  apprenantService.saveApprenant(apprenant, manyErrors, res, (apprenant) => {
    const msg = `${apprenant.nom} a été créé`;
    console.log(msg);

    return res.status(200).json(
      apiResponse({
        data: [],
        status: 1,
        errors: [],
        message: msg,
      })
    );
  });
}
/*---------------------------------------------------------------------------------------------*/

// Update d'un apprenant (PUT)
function updateApprenant(req, res) {
  console.log("UPDATE recu apprenant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };
  const modifications = req.body;

  if (!checkError.handleErrorPasswordInBody(req, res)) {
    apprenantService.updateApprenant(
      condition,
      modifications,
      res,
      (apprenant) => {
        const msg = `${apprenant.nom} a été modifié`;
        console.log(msg);
        res.status(200).json(
          apiResponse({
            data: [],
            status: 1,
            errors: [],
            message: msg,
          })
        );
      }
    );
  }
}
/*---------------------------------------------------------------------------------------------*/

// suppression d'un apprenant (DELETE)
function deleteApprenant(req, res) {
  const condition = { matricule: req.params.id };

  apprenantService.deleteApprenant(condition, res, (apprenant) => {
    const msg = `${apprenant.nom} a été supprimé`;
    console.log(msg);
    res.status(200).json(
      apiResponse({
        data: [],
        status: 1,
        errors: [],
        message: msg,
      })
    );
  });
}

module.exports = {
  getApprenants,
  getApprenant,
  searchApprenants,
  postApprenant,
  updateApprenant,
  deleteApprenant,
};
