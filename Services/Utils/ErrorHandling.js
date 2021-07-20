const apiResponse = require("../../Models/apiResponse");
const res = require("express");
const mongoose = require("mongoose");
const MSG = require("../../Messages/messages");

function handleErrors(err, res, manyErrors) {
  if (err) {
    console.error(err.message);
    if (manyErrors) {
      const err_message = manyErrors.length > 0 ? undefined : err.message;
      if (
        err.message.includes("E11000") ||
        err instanceof mongoose.Error.ValidationError
      ) {
        return res.status(400).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_400, manyErrors, err_message].filter((x) => x),
          })
        );
      }
    }

    const err_message = manyErrors.length > 0 ? undefined : err.message;
    return res.status(500).json(
      apiResponse({
        data: [],
        status: 0,
        errors: [MSG.HTTP_500, manyErrors, err_message].filter((x) => x),
      })
    );
  }
}

function handleNoItem(res, item, msg) {
  if (!item) {
    console.warn(`Impossible de trouver l'objet - ${msg}`);
    return res.status(404).json(
      apiResponse({
        data: [],
        status: 0,
        errors: [MSG.HTTP_404],
      })
    );
  }
}

function returnFatalError(err, res) {
  console.error(err);
  res.status(500).json(
    apiResponse({
      data: [],
      status: 0,
      errors: ["Erreur fatal: ", err.message],
    })
  );
}

function handleErrorPasswordInBody(req, res) {
  if (req.body.password)
    return res.status(400).json(
      apiResponse({
        data: [],
        status: 0,
        errors: [MSG.HTTP_400],
        message: "Le mot de passe ne peut pas etre modifie ici",
      })
    );
}

module.exports = { handleErrors, returnFatalError, handleNoItem, handleErrorPasswordInBody };
