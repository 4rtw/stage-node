const checkError = require("./Utils/ErrorHandling");
const apiResponse = require("../Models/apiResponse");
const Facturation = require("../Models/facturation");
const opts = { runValidators: true, new: true };

function saveFacture(facture, res, manyErrors) {
  facture.save((err) => {
    try {
      if (!checkError.handleErrors(err, res, manyErrors)) {
        const msg = `${facture.idFacture} a été créé`;
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

function updateFactureBySet(conditions, modifications, res) {
  Facturation.findOneAndUpdate(
    conditions,
    modifications,
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

function getFactureAndDoCallback(conditions, res, callback) {
  Facturation.findOne(conditions, null, opts, (err, facturation) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (!checkError.handleNoItem(res, facturation, conditions.idFacture)) {
          callback(facturation);
        }
      }
    } catch (e) {
      checkError.returnFatalError(e, res);
    }
  });
}

function getFacturesAndDoCallback(filter, res, callback) {
  Facturation.find(filter, (err, facturations) => {
    try {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (
          !checkError.handleNoItem(
            res,
            facturations,
            "Activité - Aucune facturation trouvée"
          )
        ) {
          callback(facturations);
        }
      }
    } catch (e) {
      checkError.returnFatalError(err, res);
    }
  });
}

module.exports = {
  getFacturesAndDoCallback,
  saveFacture,
  updateFactureBySet,
  getFactureAndDoCallback,
};
