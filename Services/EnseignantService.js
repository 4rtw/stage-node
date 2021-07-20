const Enseignants = require("../Models/enseignant");
const checkError = require("./Utils/ErrorHandling");
const opts = { runValidators: true, new: true };

function getEnseignantAndDoCallback(condition, res, manyErrors, callback) {
  Enseignants.findOne(condition, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        if (!checkError.handleNoItem(res, enseignant, condition.matricule)) {
          callback(enseignant);
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  }).select("-password");
}

function getPaginateEnseignants(query, pages, res, callback) {
  Enseignants.aggregatePaginate(query, pages, (err, enseignants) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        callback(enseignants);
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

function saveEnseignant(enseignant, res, manyErrors, callback) {
  enseignant.save((err) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        callback(enseignant);
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

function updateEnseignant(condition, modification, res, callback) {
  Enseignants.findOneAndUpdate(
    condition,
    modification,
    opts,
    (err, enseignant) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, enseignant, condition.matricule)) {
            callback(enseignant);
          }
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
    }
  );
}

function deleteEnseignant(condition, res, callback) {
  Enseignants.findOneAndRemove(condition, (err, enseignant) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, enseignant, condition.matricule)) {
          callback(enseignant);
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

module.exports = {
  deleteEnseignant,
  updateEnseignant,
  saveEnseignant,
  getPaginateEnseignants,
  getEnseignantAndDoCallback,
};
