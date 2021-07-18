require("dotenv").config();
const CryptoJS = require("crypto-js");
const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const apprenants = require("../Models/apprenants");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");
const checkError = require("../Services/ErrorHandling");

/*---------------------------------------------------------------------------------------------*/
//Lister les apprenants (GET)
function getApprenants(req, res) {
  let aggregateQuery = apprenants.aggregate([{ $unset: "password" }]);

  apprenants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, apprenants) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
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
      } catch (error) {
        console.error;
      }
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

  apprenants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, apprenants) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          console.log(
            `Obtention de tous les apprenants contenant ` + searchString
          );
          res.status(200).json(
            apiResponse({
              data: apprenants,
              status: 1,
              errors: [],
              message: MSG.HTTP_200,
            })
          );
        }
      } catch (error) {
        checkError.returnFatalError(err, res);
      }
    }
  );
}
/*---------------------------------------------------------------------------------------------*/

//Recuperer un apprenant par son id (GET)
function getApprenant(req, res) {
  const condition = { matricule: req.params.id };

  apprenants
    .findOne(condition, (err, apprenant) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
            res.status(200).json(
              apiResponse({
                data: apprenant,
                status: 1,
                errors: [],
                message: MSG.HTTP_200,
              })
            );
          }
        }
      } catch (error) {
        checkError.returnFatalError(error, res);
      }
    })
    .select("-password");
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

  apprenant.save((err) => {
    try {
      //Si la fonction ne renvoie aucune erreur
      if (!checkError.handleErrors(err, res, manyErrors)) {
        const msg = `${apprenant.nom} a été créé`;
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
    } catch (error) {
      checkError.returnFatalError(error, res);
    }
  });
}
/*---------------------------------------------------------------------------------------------*/

// Update d'un apprenant (PUT)
function updateApprenant(req, res) {
  console.log("UPDATE recu apprenant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  if (!checkError.handleErrorPasswordInBody(req, res)) {
    apprenants.findOneAndUpdate(condition, req.body, opts, (err, apprenant) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
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
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
    });
  }
}
/*---------------------------------------------------------------------------------------------*/

// suppression d'un apprenant (DELETE)
function deleteApprenant(req, res) {
  const condition = { matricule: req.params.id };

  apprenants.findOneAndRemove(condition, (err, apprenant) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
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
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
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
