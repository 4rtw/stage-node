const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Facturation = require("../Models/facturation");
const Enseignants = require("../Models/enseignant");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
// Ajout d'une facturation (POST)
function postFacturation(req, res) {
  const facturation = new Facturation();

  for (const [key, value] of Object.entries(req.body)) {
    facturation[key] = value;
  }

  const manyErrors = validate(facturation, [
    "idFacture",
    "details",
    "enseignements",
    "cloture",
    "idEnseignant",
    "activite",
  ]);
  console.log("POST facturation reçu :");
  console.log(facturation);

  const condition = { matricule: req.body.details.idEnseignant };

  //Check si l'enseignant existe, si oui -> créer facture, si non -> renvoyer une érreur
  Enseignants.findOne(condition, (err, enseignant) => {
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

    if (!enseignant) {
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

    //save facturation
    facturation.save((err) => {
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
              errors: [MSG.HTTP_400, ...manyErrors, err_message].filter(
                (x) => x
              ),
              message: "",
            })
          );
        }
        return res.status(500).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_500, ...manyErrors, err_message].filter((x) => x),
            message: "L'opération n'a pas abouti",
          })
        );
      }

      const msg = `${facturation.idFacture} a été créé`;

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
  });
}

/*---------------------------------------------------------------------------------------------*/
// Update d'une facturation - ajout enseignement (PUT)
function addEnseignementToFacturation(req, res) {
  console.log("Add recu Enseignement to facturation : " + req.body);
  const condition = {
    idFacture: req.body.idFacture,
  };
  const opts = { runValidators: true, new: true };

  Facturation.findOne(condition, null, opts, (err, facturation) => {
    const enseignements = facturation.enseignements;
    const newEnseignements = req.body.enseignements;

    const allEnseignements = enseignements.concat(newEnseignements);

    Facturation.findOneAndUpdate(
      condition,
      { $set: { enseignements: allEnseignements } },
      opts,
      (err, facturation) => {
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

        if (!facturation) {
          console.warn(
            `Impossible de trouver la facture  -> [ID = ${condition.idFacture}]`
          );

          return res.status(404).json(
            apiResponse({
              data: [],
              status: 0,
              errors: [MSG.HTTP_404],
              message: `La facture [ID = ${condition.idFacture}] n'existe pas`,
            })
          );
        }

        const msg = `${facturation.idFacture} a été modifié`;

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
  });
}

/*---------------------------------------------------------------------------------------------*/
// Update d'une facturation - cloture (PUT)
function closeFacture(req, res) {
  console.log("Add recu Enseignement to facturation : " + req.body);
  const condition = {
    idFacture: req.body.idFacture,
  };
  const opts = { runValidators: true, new: true };

  Facturation.findOneAndUpdate(
    condition,
    { $set: { cloture: true } },
    opts,
    (err, facturation) => {
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

      if (!facturation) {
        console.warn(
          `Impossible de trouver la facture  -> [ID = ${condition.idFacture}]`
        );

        return res.status(404).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_404],
            message: `La facture [ID = ${condition.idFacture}] n'existe pas`,
          })
        );
      }

      const msg = `${facturation.idFacture} a été cloturé`;

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
//Lister les facturation (GET)
function listFacturationsByActivity(req, res) {
  const activite = {
    mois: parseInt(req.query.month, 10),
    periode: parseInt(req.query.periode, 10),
  };

  Facturation.find(
    {
      activite: activite,
    },
    (err, facturation) => {
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
        `Obtention de toutes les factures du mois: ${req.query.month} de la periode: ${req.query.periode}`
      );
      res.status(200).json(
        apiResponse({
          data: facturation,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}

//Lister les facturation (GET)
function listFacturationsByEnseignant(req, res) {
  Facturation.find(
    {
      idEnseignant: parseInt(req.query.idEnseignant, 10),
    },
    (err, facturation) => {
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
        `Obtention de toutes les factures de l'enseignant ${req.query.idEnseignant}`
      );
      res.status(200).json(
        apiResponse({
          data: facturation,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}

//Lister les facturation (GET)
function listFacturationsByActivityByEnseignants(req, res) {
  const activite = {
    mois: parseInt(req.query.month, 10),
    periode: parseInt(req.query.periode, 10),
  };

  Facturation.find(
    {
      $and: [
        { activite: activite },
        { idEnseignant: parseInt(req.query.idEnseignant, 10) },
      ],
    },
    (err, facturation) => {
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
        `Obtention de toutes les factures du mois: ${req.query.month} de la periode: ${req.query.periode} de l'enseignant ${req.query.idEnseignant}`
      );
      res.status(200).json(
        apiResponse({
          data: facturation,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}

/*---------------------------------------------------------------------------------------------*/
module.exports = {
  postFacturation,
  addEnseignementToFacturation,
  closeFacture,
  listFacturationsByActivity,
  listFacturationsByActivityByEnseignants,
  listFacturationsByEnseignant,
};
