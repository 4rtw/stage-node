const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const PayementFrais = require("../Models/payementFrais");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");
const checkError = require("../Services/ErrorHandling");

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un payement (POST)
function postPayementFrais(req, res) {
  const payement = new PayementFrais();
  const keys = [];

  for (const [key, value] of Object.entries(req.body)) {
    payement[key] = value;
    keys.push(key);
  }

  console.log("POST Payement reçu :");
  console.log(payement);

  const manyErrors = validate(payement, keys);

  payement.save((err) => {
    if (!checkError.handleErrors(err, res, manyErrors)) {
      const msg = `${payement.idPayement} - Payement éffectué`;

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
  });
}

/*---------------------------------------------------------------------------------------------*/
// suppression d'un Enseignant (DELETE)
function deletePayementFrais(req, res) {
  const condition = { idPayement: req.params.id };

  PayementFrais.findOneAndRemove(condition, (err, payementFrais) => {
    if (!checkError.handleErrors(err, res, undefined)) {
      if (!checkError.handleNoItem(res, payementFrais, condition.idPayement)) {
        const msg = `${payementFrais.idPayement} a été supprimé`;

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
  });
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
//Recuperer un payement par son id (GET)
function getPayementFrais(req, res) {
  const condition = { idPayement: req.params.id };

  PayementFrais.findOne(condition, (err, payementFrais) => {
    if (!checkError.handleErrors(err, res, undefined)) {
      if (!checkError.handleNoItem(res, payementFrais, condition.idPayement)) {
        res.status(200).json(
          apiResponse({
            data: payementFrais,
            status: 1,
            errors: [],
            message: MSG.HTTP_200,
          })
        );
      }
    }
  });
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
//Lister les Enseignants (GET)
function getPayementsFraisByPeriodeAndInsciption(req, res) {
  const periode = req.query.periode;
  const idInscription = req.query.idInscription;

  PayementFrais.find(
    {
      $and: [
        {
          periode: parseInt(periode, 10),
        },
        {
          idInscription: parseInt(idInscription, 10),
        },
      ],
    },
    (err, payement) => {
      if (!checkError.handleErrors(err, res, undefined)) {
        if (
          !checkError.handleNoItem(res, payement, periode + "-" + idInscription)
        ) {
          res.status(200).json(
            apiResponse({
              data: payement,
              status: 1,
              errors: [],
              message: MSG.HTTP_200,
            })
          );
        }
      }
    }
  );
}
/*---------------------------------------------------------------------------------------------*/
module.exports = {
  postPayementFrais,
  deletePayementFrais,
  getPayementFrais,
  getPayementsFraisByPeriodeAndInsciption,
};
