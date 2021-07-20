const checkError = require("./Utils/ErrorHandling");
const PayementFrais = require("../Models/payementFrais");

function savePayement(payement, manyErrors, res, callback) {
  payement.save((err) => {
    if (!checkError.handleErrors(err, res, manyErrors)) {
      callback(payement);
    }
  });
}

function deletePayement(condition, res, callback) {
  PayementFrais.findOneAndRemove(condition, (err, payementFrais) => {
    if (!checkError.handleErrors(err, res, undefined)) {
      if (!checkError.handleNoItem(res, payementFrais, condition.idPayement)) {
        callback(payementFrais);
      }
    }
  });
}

function getPayement(condition, res, callback) {
  PayementFrais.findOne(condition, (err, payementFrais) => {
    if (!checkError.handleErrors(err, res, undefined)) {
      if (!checkError.handleNoItem(res, payementFrais, condition.idPayement)) {
        callback(payementFrais);
      }
    }
  });
}

function getPayements(filter, res, callback) {
  PayementFrais.find(filter, (err, payement) => {
    if (!checkError.handleErrors(err, res, undefined)) {
      if (
        !checkError.handleNoItem(res, payement, periode + "-" + idInscription)
      ) {
          callback(payement)
      }
    }
  });
}

module.exports = { savePayement, deletePayement, getPayement, getPayements };
