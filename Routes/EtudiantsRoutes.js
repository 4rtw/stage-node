const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Etudiants = require("../Models/etudiants");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
//Lister les étudiants (GET)
function getEtudiants(req, res) {
  let aggregateQuery = Etudiants.aggregate();

  Etudiants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, etudiants) => {
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
          data: etudiants,
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
function searchEtudiants(req, res) {
  let searchString = req.query.searchString;
  let aggregateQuery = Etudiants.aggregate([
    { $match: { $text: { $search: searchString } } },
  ]);

  Etudiants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, etudiants) => {
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
          data: etudiants,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}
/*---------------------------------------------------------------------------------------------*/

//Recuperer un etudiant par son id (GET)
function getEtudiant(req, res) {
  const condition = { matricule: req.params.id };

  Etudiants.findOne(condition, (err, etudiant) => {
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

    if (!etudiant) {
      console.warn(
        `Impossible de trouver l'etudiant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le etudiant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    res.status(200).json(
      apiResponse({
        data: etudiant,
        status: 1,
        errors: [],
        message: MSG.HTTP_200,
      })
    );
  });
}
/*---------------------------------------------------------------------------------------------*/

// Ajout d'un etudiant (POST)
function postEtudiant(req, res) {
  let etudiant = new Etudiants();
  etudiant.matricule = req.body.matricule;
  etudiant.nom = req.body.nom;
  etudiant.prenom = req.body.prenom;
  etudiant.telephone = req.body.telephone;
  etudiant.adresse = req.body.adresse;
  etudiant.email = req.body.email;
  etudiant.contacts_Tuteur_Parent = req.body.contacts_Tuteur_Parent;

  console.log("POST etudiant reçu :" + etudiant);

  const manyErrors = validate(etudiant, [
    "id",
    "matricule",
    "nom",
    "prenom",
    "contacts",
  ]);

  etudiant.save(err => {
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
            errors: [MSG.HTTP_400, ...manyErrors, err_message].filter(x => x),
            message: "",
          })
        );
      }
      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, ...manyErrors, err_message].filter(x => x),
          message: "L'opération n'a pas aboutie",
        })
      );
    }

    const msg = `${etudiant.nom} a été créé`;

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

// Update d'un etudiant (PUT)
function updateEtudiant(req, res) {
  console.log("UPDATE recu etudiant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  Etudiants.findOneAndUpdate(condition, req.body, opts, (err, etudiant) => {
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

    if (!etudiant) {
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

    const msg = `${etudiant.nom} a été modifié`;

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

// suppression d'un etudiant (DELETE)
function deleteEtudiant(req, res) {
  const condition = { matricule: req.params.id };

  Etudiants.findOneAndRemove(condition, (err, etudiant) => {
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

    if (!etudiant) {
      console.warn(
        `Impossible de trouver l'etudiant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `L'etudiant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    const msg = `${etudiant.nom} a été supprimé`;

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

/*-----------------------------------------------------------------------------------*/
const addStudentToParcours = function (EtudiantMatricule, ParcoursID) {
  return Etudiants.findByIdAndUpdate(
    EtudiantMatricule,
    { parcours: ParcoursID },
    { new: true, useFindAndModify: false }
  );
};

/*-----------------------------------------------------------------------------------*/

module.exports = {
  getEtudiants,
  getEtudiant,
  searchEtudiants,
  postEtudiant,
  updateEtudiant,
  deleteEtudiant,
};
