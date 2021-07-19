require("dotenv").config();
const MSG = require("../Messages/messages");
const Facturation = require("../Models/facturation");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");
const factureService = require("../Services/FacturationService");
const enseignantService = require("../Services/EnseignantService");
/*---------------------------------------------------------------------------------------------*/
// Ajout d'une facturation (POST)
function postFacturation(req, res) {
  const facturation = new Facturation();
  const keys = [];
  for (const [key, value] of Object.entries(req.body)) {
    facturation[key] = value;
    keys.push(key);
  }
  facturation.idEnseignant = facturation.details.idEnseignant;
  facturation.activite = {
    periode: facturation.details.periode,
    mois: facturation.details.mois,
  };
  if (!req.body.enseignements) {
    facturation.enseignements = [];
  }

  const manyErrors = validate(facturation, keys);
  const condition = { matricule: req.body.details.idEnseignant };

  //Check si l'enseignant existe, si oui -> créer facture, si non -> renvoyer une érreur
  enseignantService.getEnseignantAndDoCallback(
    condition,
    res,
    manyErrors,
    (enseignant) => {
      facturation.idEnseignant = enseignant.matricule;
      factureService.saveFacture(facturation, res, manyErrors);
    }
  );
}

/*---------------------------------------------------------------------------------------------*/
// Update d'une facturation - ajout enseignement (PUT)
function addEnseignementToFacturation(req, res) {
  console.log("Add recu Enseignement to facturation : " + req.body);
  const condition = {
    idFacture: req.body.idFacture,
  };

  factureService.getFactureAndDoCallback(condition, (facturation) => {
    const enseignements = facturation.enseignements;
    const newEnseignements = req.body.enseignements;
    let allEnseignements = enseignements.concat(newEnseignements);
    allEnseignements = Array.from(new Set(allEnseignements));
    const modifications = { $set: { enseignements: allEnseignements } };

    factureService.updateFactureBySet(condition, modifications, res);
  });
}

// Update d'une facturation - cloture (PUT)
function closeFacture(req, res) {
  console.log("Cloture recu facturation : " + req.body);
  const condition = {
    idFacture: req.body.idFacture,
  };

  const modifications = { $set: { cloture: true } };

  factureService.updateFactureBySet(condition, modifications, res);
}

//Lister les facturation (GET)
function listFacturationsByActivity(req, res) {
  const activite = {
    mois: parseInt(req.query.month, 10),
    periode: parseInt(req.query.periode, 10),
  };

  const filter = { activite: activite };

  factureService.getFacturesAndDoCallback(filter, res, (facturation) => {
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
  });
}

//Lister les facturation (GET)
function listFacturationsByEnseignant(req, res) {
  const filter = { idEnseignant: parseInt(req.query.idEnseignant, 10) };
  factureService.getFacturesAndDoCallback(filter, res, (facturations) => {
    console.log(
      `Obtention de toutes les factures de l'enseignant ${req.query.idEnseignant}`
    );
    res.status(200).json(
      apiResponse({
        data: facturations,
        status: 1,
        errors: [],
        message: MSG.HTTP_200,
      })
    );
  });
}

//Lister les facturation (GET)
function listFacturationsByActivityByEnseignants(req, res) {
  const activite = {
    mois: parseInt(req.query.month, 10),
    periode: parseInt(req.query.periode, 10),
  };

  const filter = {
    $and: [
      { activite: activite },
      { idEnseignant: parseInt(req.query.idEnseignant, 10) },
    ],
  };

  factureService.getFacturesAndDoCallback(filter, res, (facturation)=> {
    console.log(`Obtention de toutes les factures du mois: ${req.query.month} de la periode: ${req.query.periode} de l'enseignant ${req.query.idEnseignant}`);
    return res.status(200).json(
        apiResponse({
          data: facturation,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        }));
  });
}

function getFactureByEnseignantByMonth(idEnseignant, month) {
  // TODO getFacture
  Facturation.findOne();
}
/*---------------------------------------------------------------------------------------------*/
module.exports = {
  postFacturation,
  addEnseignementToFacturation,
  closeFacture,
  listFacturationsByActivity,
  listFacturationsByActivityByEnseignants,
  listFacturationsByEnseignant,
  getFactureByEnseignantByMonth,
};
