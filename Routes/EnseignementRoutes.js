require("dotenv").config();
const Enseignement = require("../Models/enseignement");
const validate = require("../Services/Validation");
const Enseignant = require("../Models/enseignant");
const checkError = require("../Services/ErrorHandling");
const apiResponse = require("../Models/apiResponse");
const Apprenant = require("../Models/apprenants");
const time = require("../Services/HourDifferenceCalculator");

function postEnseignements(req, res) {
  const enseignement = new Enseignement();
  const keys = [];

  enseignement.heureDebut = new Date().toLocaleString();
  enseignement.check = [enseignement.heureDebut];

  for (const [key, value] of Object.entries(req.body)) {
    enseignement[key] = value;
    keys.push(key);
  }

  enseignement.heureFin = undefined;
  enseignement.volume = undefined;
  enseignement.cloture = false;

  //TODO Matricule pointeur selon token

  // format de la date '18 Jul 2021 16:44:00'
  enseignement.heureDebut = new Date().toLocaleString();

  const manyErrors = validate(enseignement, keys);
  const conditionEnseignant = { matricule: req.body.matriculeEnseignant };
  const conditionPointeur = { matricule: req.body.matriculePointeur };
  Enseignant.findOne(conditionEnseignant, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        if (
          !checkError.handleNoItem(
            res,
            enseignant,
            conditionEnseignant.matricule
          )
        ) {
          // TODO verify EC
          Apprenant.findOne(conditionPointeur, (err, apprenant) => {
            try {
              if (!checkError.handleErrors(err, res, undefined)) {
                if (
                  !checkError.handleNoItem(
                    res,
                    apprenant,
                    conditionPointeur.matricule
                  )
                ) {
                  Enseignement.find({matriculeEnseignant: enseignant.matricule, cloture: false}, (err, enseignements) => {
                    if( !checkError.handleErrors(err,res,undefined)){
                      if (!checkError.handleNoItem(err, enseignements, enseignement.idEnseignement)){
                        if (enseignements.length === 0){
                          // accordé
                          enseignement.save((err) => {
                            try {
                              if (!checkError.handleErrors(err, res, manyErrors)) {
                                const msg = `${enseignement.idEnseignement} a été enregistré`;
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
                            } catch (e) {
                              checkError.returnFatalError(e, res);
                            }
                          });
                        }
                        else{
                          const msg = "Cet enseignant a déjà un cours actuellement."
                          // non accordé
                          return res.status(400).json(
                              apiResponse({
                                data: [],
                                status: 1,
                                errors: [],
                                message: msg,
                              })
                          );
                        }
                      }
                    }
                  })
                }
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

function closeEnseignement(req, res) {
  const condition = {
    idEnseignement: req.body.idEnseignement,
    cloture: false
  };

  const heureFin = new Date().toLocaleString();

  const opts = { runValidators: true, new: true };

  Enseignement.findOne(condition, (err, enseignement) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (
          !checkError.handleNoItem(res, enseignement, condition.idEnseignement)
        ) {
          enseignement.cloture = true;
          enseignement.heureFin = heureFin;

          let volumeHeure = 0;
          let volumeMinutes = 0;

          const diff = time.timeDiffCalc(new Date(heureFin), new Date(enseignement.heureDebut))

          if (diff.length === 2){
            volumeHeure = diff[0];
            volumeMinutes = diff[1];
          }

          enseignement.volume = {
            heures: volumeHeure,
            minutes: volumeMinutes
          }
          enseignement.save()
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
  Enseignement.findOneAndUpdate(
    condition,
    { $set: { cloture: true, heureFin: heureFin } },
    opts,
    (err, enseignement) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (
            !checkError.handleNoItem(
              res,
              enseignement,
              condition.idEnseignement
            )
          ) {
            const msg = `${enseignement.idEnseignement} a été cloturé`;

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
        checkError.returnFatalError(err, res);
      }
    }
  );
}

module.exports = { postEnseignements, closeEnseignement };
