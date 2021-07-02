const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Enseignants = require("../Models/enseignant");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
//Lister les Enseignants (GET)
function getEnseignants(req, res) {
  let aggregateQuery = Enseignants.aggregate();

  Enseignants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, Enseignants) => {
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
      console.log(`Obtention de tous les Enseignants`);
      res.status(200).json(
        apiResponse({
          data: Enseignants,
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
  let searchString = req.query.searchString;
  let aggregateQuery = Enseignants.aggregate([
    { $match: { $text: { $search: searchString } } },
  ]);

  Enseignants.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, Enseignants) => {
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
      console.log(
        `Obtention de tous les Enseignants contenant ` + searchString
      );
      res.status(200).json(
        apiResponse({
          data: Enseignants,
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

  Enseignants.findOne(condition, (err, Enseignant) => {
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

    if (!Enseignant) {
      console.warn(
        `Impossible de trouver le Enseignant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le Enseignant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    res.status(200).json(
      apiResponse({
        data: Enseignant,
        status: 1,
        errors: [],
        message: MSG.HTTP_200,
      })
    );
  });
}

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un Enseignant (POST)
function postEnseignant(req, res) {
  let Enseignant = new Enseignants();
  Enseignant.id = req.body.id;
  Enseignant.matricule = req.body.matricule;
  Enseignant.nom = req.body.nom;
  Enseignant.prenom = req.body.prenom;
  Enseignant.contacts = req.body.contacts;

  console.log("POST Enseignant reçu :");
  console.log(Enseignant);

  const manyErrors = validate(Enseignant, [
    "id",
    "matricule",
    "nom",
    "prenom",
    "contacts",
  ]);

  Enseignant.save(err => {
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
          message: "L'opération n'a pas abouti",
        })
      );
    }

    const msg = `${Enseignant.nom} a été créé`;

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
// Update d'un Enseignant (PUT)
function updateEnseignant(req, res) {
  console.log("UPDATE recu Enseignant : " + req.body);

  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  Enseignants.findOneAndUpdate(condition, req.body, opts, (err, Enseignant) => {
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

    if (!Enseignant) {
      console.warn(
        `Impossible de trouver le Enseignant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `L'Enseignant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    const msg = `${Enseignant.nom} a été modifié`;

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
// suppression d'un Enseignant (DELETE)
function deleteEnseignant(req, res) {
  const condition = { matricule: req.params.id };

  Enseignants.findOneAndRemove(condition, (err, Enseignant) => {
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

    if (!Enseignant) {
      console.warn(
        `Impossible de trouver le Enseignant  -> [ID = ${condition.matricule}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le Enseignant [ID = ${condition.matricule}] n'existe pas`,
        })
      );
    }

    const msg = `${Enseignant.nom} a été supprimé`;

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
