const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const apprenants = require("../Models/apprenants");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
//Lister les étudiants (GET)
function getApprenants(req, res) {
  let aggregateQuery = apprenants.aggregate();

  apprenants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, apprenants) => {
      if (err) {
        console.error(err.message);

        return res.status(500).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_500, err.message],
            message: "L'opération n'a pas abouti",
          })
        );
      }
      console.log(`Obtention de tous les étudiants`);
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
//Rechercher les étudiants (GET)
function searchApprenants(req, res) {
  let searchString = req.query.searchString;
  let aggregateQuery = apprenants.aggregate([
    { $match: { $text: { $search: searchString } } },
  ]);

  apprenants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, apprenants) => {
      if (err) {
        console.error(err.message);

        return res.status(500).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_500, err.message],
            message: "L'opération n'a pas abouti",
          })
        );
      }
      console.log(`Obtention de tous les étudiants contenant ` + searchString);
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

  apprenants.findOne(condition, (err, apprenant) => {
    if (err) {
      console.error(err.message);

      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, err.message],
          message: "L'opération n'a pas abouti",
        })
      );
    }

    if (!apprenant) {
      console.warn(
        `Impossible de trouver l'apprenant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le apprenant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    res.status(200).json(
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
  let apprenant = new apprenants();
  apprenant.matricule = req.body.matricule;
  apprenant.nom = req.body.nom;
  apprenant.prenom = req.body.prenom;
  apprenant.email = req.body.email;
  apprenant.telephones = req.body.telephones;
  apprenant.adresse = req.body.adresse;
  apprenant.baccalaureat = req.body.baccalaureat;
  apprenant.autresDiplomes = req.body.autresDiplomes;
  apprenant.anneeInscription = req.body.anneeInscription;
  apprenant.photoUrl = req.body.photoUrl;
  apprenant.parentsTuteur = req.body.parentsTuteur;
  apprenant.naissance = req.body.naissance;

  console.log("POST apprenant reçu :" + apprenant);

  const manyErrors = validate(apprenant, [
    "matricule",
    "nom",
    "prenom",
    "email",
    "telephones",
    "adresse",
    "baccalaureat",
    "autresDiplomes",
    "anneeInscription",
    "photoUrl",
    "parentsTuteur",
    "naissance",
  ]);

  apprenant.save((err) => {
    if (err) {
      console.error(err.message);
      const err_message = manyErrors.length > 0 ? undefined : err.message;
      if (
        err.message.includes("E11000") ||
        err instanceof mongoose.Error.ValidationError
      ) {
        return res.status(400).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_400, ...manyErrors, err_message].filter((x) => x),
            message: "",
          })
        );
      }
      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, ...manyErrors, err_message].filter((x) => x),
          message: "L'opération n'a pas aboutie",
        })
      );
    }

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
  });
}
/*---------------------------------------------------------------------------------------------*/

// Update d'un apprenant (PUT)
function updateApprenant(req, res) {
  console.log("UPDATE recu apprenant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  apprenants.findOneAndUpdate(condition, req.body, opts, (err, apprenant) => {
    if (err) {
      console.error(err.message);

      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, err.message],
          message: "L'opération n'a pas abouti",
        })
      );
    }

    if (!apprenant) {
      console.warn(
        `Impossible de trouver l'étudiant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `L'étudiant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

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
  });
}
/*---------------------------------------------------------------------------------------------*/

// suppression d'un apprenant (DELETE)
function deleteApprenant(req, res) {
  const condition = { matricule: req.params.id };

  apprenants.findOneAndRemove(condition, (err, apprenant) => {
    if (err) {
      console.error(err.message);

      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, err.message],
          message: "L'opération n'a pas abouti",
        })
      );
    }

    if (!apprenant) {
      console.warn(
        `Impossible de trouver l'apprenant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `L'apprenant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

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
