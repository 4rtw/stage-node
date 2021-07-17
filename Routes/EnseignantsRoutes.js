require("dotenv").config();
const CryptoJS = require("crypto-js");
const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Enseignants = require("../Models/enseignant");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");
const checkError = require("../Services/ErrorHandling");

/*---------------------------------------------------------------------------------------------*/
//Lister les Enseignants (GET)
function getEnseignants(req, res) {
  const aggregateQuery = Enseignants.aggregate([{ $unset: "password" }]);

  Enseignants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, enseignants) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          console.log(`Obtention de tous les Enseignants`);
          res.status(200).json(
            apiResponse({
              data: enseignants,
              status: 1,
              errors: [],
              message: MSG.HTTP_200,
            })
          );
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
    }
  );
}

/*---------------------------------------------------------------------------------------------*/
//Rechercher les Enseignants (GET)
function searchEnseignants(req, res) {
  const searchString = req.query.searchString;
  const aggregateQuery = Enseignants.aggregate([
    { $match: { $text: { $search: searchString } } },
    { $unset: "password" },
  ]);

  Enseignants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, enseignants) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          console.log(
            `Obtention de tous les Enseignants contenant ` + searchString
          );
          res.status(200).json(
            apiResponse({
              data: enseignants,
              status: 1,
              errors: [],
              message: MSG.HTTP_200,
            })
          );
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
    }
  );
}

/*---------------------------------------------------------------------------------------------*/
//Recuperer un Enseignant par son id (GET)
function getEnseignant(req, res) {
  const condition = { matricule: req.params.id };

  Enseignants.findOne(condition, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, enseignant)) {
          res.status(200).json(
            apiResponse({
              data: enseignant,
              status: 1,
              errors: [],
              message: MSG.HTTP_200,
            })
          );
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  }).select("-password");
}

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un Enseignant (POST)
function postEnseignant(req, res) {
  const enseignant = new Enseignants();
  const keys = [];
  for (const [key, value] of Object.entries(req.body)) {
    enseignant[key] = value;
    keys.push(key);
  }

  enseignant.password = CryptoJS.AES.encrypt(
    req.body.matricule + req.body.matricule,
    process.env.SALT_PASSWORD_ENSEIGNANT
  );

  const manyErrors = validate(enseignant, keys);

  enseignant.save((err) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        const msg = `${enseignant.nom} a été créé`;
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
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

/*---------------------------------------------------------------------------------------------*/
// Update d'un Enseignant (PUT)
function updateEnseignant(req, res) {
  console.log("UPDATE recu Enseignant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  if (!checkError.handleErrorPasswordInBody(req, res)) {
    Enseignants.findOneAndUpdate(
      condition,
      req.body,
      opts,
      (err, enseignant) => {
        try {
          if (!checkError.handleErrors(err, res, undefined)) {
            if (!checkError.handleNoItem(res, enseignant)) {
              const msg = `${enseignant.nom} a été modifié`;
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
      }
    );
  }
}

/*---------------------------------------------------------------------------------------------*/
// suppression d'un Enseignant (DELETE)
function deleteEnseignant(req, res) {
  const condition = { matricule: req.params.id };

  Enseignants.findOneAndRemove(condition, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, enseignant)) {
          const msg = `${enseignant.nom} a été supprimé`;
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
/*---------------------------------------------------------------------------------------------*/
module.exports = {
  getEnseignants,
  getEnseignant,
  searchEnseignants,
  postEnseignant,
  updateEnseignant,
  deleteEnseignant,
};
