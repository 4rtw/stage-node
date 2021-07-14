const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Facturation = require("../Models/facturation");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/*---------------------------------------------------------------------------------------------*/
// Ajout d'un Enseignant (POST)
function postFacturation(req, res) {
  let facturation = new Facturation();
  facturation.idFacture = req.body.idFacture;
  facturation.details = req.body.details;
  facturation.enseignements = req.body.enseignements;
  facturation.cloture = req.body.cloture;

  console.log("POST facturation reçu :");
  console.log(facturation);

  const manyErrors = validate(facturation, [
    "idFacture",
    "details",
    "enseignements",
    "cloture",
  ]);

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
            errors: [MSG.HTTP_400, ...manyErrors, err_message].filter((x) => x),
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
}

/*---------------------------------------------------------------------------------------------*/
module.exports = {
  postFacturation,
};
