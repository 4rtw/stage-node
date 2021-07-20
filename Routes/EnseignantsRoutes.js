require("dotenv").config();
const CryptoJS = require("crypto-js");
const MSG = require("../Messages/messages");
const Enseignants = require("../Models/enseignant");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Utils/Validation");
const checkError = require("../Services/Utils/ErrorHandling");
const enseignantService = require("../Services/EnseignantService");

/*---------------------------------------------------------------------------------------------*/
//Lister les Enseignants (GET)
function getEnseignants(req, res) {
  const aggregateQuery = Enseignants.aggregate([{ $unset: "password" }]);
  const pages = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  enseignantService.getPaginateEnseignants(
    aggregateQuery,
    pages,
    res,
    (enseignants) => {
      console.log(`Obtention de tous les Enseignants`);
      return res.status(200).json(
        apiResponse({
          data: enseignants,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
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
  const pages = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  enseignantService.getPaginateEnseignants(
    aggregateQuery,
    pages,
    res,
    (enseignants) => {
      console.log(`Obtention de tous les Enseignants`);
      return res.status(200).json(
        apiResponse({
          data: enseignants,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}

/*---------------------------------------------------------------------------------------------*/
//Recuperer un Enseignant par son id (GET)
function getEnseignant(req, res) {
  const condition = { matricule: req.params.id };

  enseignantService.getEnseignantAndDoCallback(
    condition,
    res,
    undefined,
    (enseignant) => {
      return res.status(200).json(
        apiResponse({
          data: enseignant,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
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

  enseignantService.saveEnseignant(
    enseignant,
    res,
    manyErrors,
    (enseignant) => {
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
  );
}

/*---------------------------------------------------------------------------------------------*/
// Update d'un Enseignant (PUT)
function updateEnseignant(req, res) {
  console.log("UPDATE recu Enseignant : " + req.body);

  const condition = { matricule: req.body.matricule };

  const modification = req.body;

  if (!checkError.handleErrorPasswordInBody(req, res)) {
    enseignantService.updateEnseignant(
      condition,
      modification,
      res,
      (enseignant) => {
        const msg = `${enseignant.nom} a été modifié`;
        console.log(msg);
        return res.status(200).json(
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
// suppression d'un Enseignant (DELETE)
function deleteEnseignant(req, res) {
  const condition = { matricule: req.params.id };

  enseignantService.deleteEnseignant(condition, res, (enseignant) => {
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
