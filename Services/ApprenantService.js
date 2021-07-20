const apprenants = require("../Models/apprenants");
const checkError = require("./Utils/ErrorHandling");
const opts = { runValidators: true, new: true };

function getPaginateApprenants(query, pages, res, callback) {
  apprenants.aggregatePaginate(query, pages, (err, apprenants) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        callback(apprenants);
      }
    } catch (error) {
      checkError.returnFatalError(error, res);
    }
  });
}

function getApprenant(condition, res, callback) {
  apprenants
    .findOne(condition, (err, apprenant) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
            callback(apprenant);
          }
        }
      } catch (error) {
        checkError.returnFatalError(error, res);
      }
    })
    .select("-password");
}

function saveApprenant(apprenant, manyErrors, res, callback) {
  apprenant.save((err) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        callback(apprenant);
      }
    } catch (error) {
      checkError.returnFatalError(error, res);
    }
  });
}

function updateApprenant(condition, modifications, res, callback) {
  apprenants.findOneAndUpdate(
    condition,
    modifications,
    opts,
    (err, apprenant) => {
      try {
        if (!checkError.handleErrors(err, res, undefined)) {
          if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
            callback(apprenant);
          }
        }
      } catch (e) {
        checkError.returnFatalError(e, res);
      }
    }
  );
}

function deleteApprenant(condition, res, callback) {
  apprenants.findOneAndRemove(condition, (err, apprenant) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, apprenant, condition.matricule)) {
          callback(apprenant);
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

module.exports = {
  deleteApprenant,
  getPaginateApprenants,
  getApprenant,
  saveApprenant,
  updateApprenant,
};
