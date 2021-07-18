require("dotenv").config();
const MSG = require("../Messages/messages");
const Facturation = require("../Models/facturation");
const Enseignants = require("../Models/enseignant");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");
const checkError = require("../Services/ErrorHandling");

/*---------------------------------------------------------------------------------------------*/
// Ajout d'une facturation (POST)
function postFacturation(req, res) {
  const facturation = new Facturation();
  const keys = [];

  for (const [key, value] of Object.entries(req.body)) {
    facturation[key] = value;
    keys.push(key);
  }

  if (!req.body.enseignements) {
    facturation.enseignements = [];
  }

  const manyErrors = validate(facturation, keys);
  const condition = { matricule: req.body.details.idEnseignant };

  //Check si l'enseignant existe, si oui -> créer facture, si non -> renvoyer une érreur
  Enseignants.findOne(condition, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        if (!checkError.handleNoItem(res, enseignant, condition.matricule)) {
          //save facturation
          facturation.save((err) => {
            try {
              if (!checkError.handleErrors(err, res, manyErrors)) {
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
              }
            } catch (e) {
              checkError.returnFatalError(e, res);
            }
          });
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
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
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, facturation, condition.idFacture)) {
          const enseignements = facturation.enseignements;
          const newEnseignements = req.body.enseignements;

          let allEnseignements = enseignements.concat(newEnseignements);
          allEnseignements = Array.from(new Set(allEnseignements));

          Facturation.findOneAndUpdate(
            condition,
            { $set: { enseignements: allEnseignements } },
            opts,
            (err, facturation) => {
              try {
                if (!checkError.handleErrors(err, res, undefined)) {
                  if (!checkError.handleNoItem(res, facturation)) {
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
                }
              } catch (e) {
                checkError.returnFatalError(e, res);
              }
            }
          );
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
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
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, facturation, condition.idFacture)) {
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
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
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
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (
            !checkError.handleNoItem(
              res,
              facturation,
              activite.periode + "-" + activite.mois
            )
          ) {
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
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
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
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (
            !checkError.handleNoItem(res, facturation, req.query.idEnseignant)
          ) {
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
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
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
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
            if (!checkError.handleNoItem(res, facturation, activite.periode + " " + activite.mois))
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
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
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
