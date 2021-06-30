const MSG = require("../Messages/messages");
const mongoose = require("mongoose");
const Parcours = require("../Models/Parcours");
const apiResponse = require("../Models/apiResponse");
const validate = require("../Services/Validation");

/**
 * Ajouter POST
 */
function addParcours(req, res) {
  let parcours = new Parcours();
  parcours.code = req.body.code;
  parcours.niveau = req.body.niveau;
  parcours.mention = req.body.mention;
  parcours.specialisation = req.body.specialisation;
  parcours.frais = req.body.frais;

  console.log("POST parcours reçu :" + parcours);

  const manyErrors = validate(parcours, [
    "code",
    "niveau",
    "mention",
    "specialisation",
    "frais",
  ]);

  parcours.save(err => {
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
            errors: [MSG.HTTP_400, ...manyErrors, err_message].filter(x => x),
            message: "",
          })
        );
      }
      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, ...manyErrors, err_message].filter(x => x),
          message: "L'opération n'a pas aboutie",
        })
      );
    }

    const msg = `${parcours.code} a été créé`;

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
/* ------------------------------------------------------------------------- */

/**
 * Lister
 */
function listParcours(req, res) {
  let aggregateQuery = Parcours.aggregate();

  Parcours.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 15,
    },
    (err, parcours) => {
      if (err) {
        console.error(err.message);

        return res.status(500).json(
          apiResponse({
            data: [],
            status: 0,
            errors: [MSG.HTTP_500, err.message],
            message: "L'opération n'a pas abouti",
          })
        );
      }
      console.log(`Obtention de tous les parcours`);
      res.status(200).json(
        apiResponse({
          data: parcours,
          status: 1,
          errors: [],
          message: MSG.HTTP_200,
        })
      );
    }
  );
}
/* ------------------------------------------------------------------------- */

/**
 * Get One
 */
function getOneParcours(req, res) {
  const condition = { code: req.params.id };

  Parcours.findOne(condition, (err, parcours) => {
    if (err) {
      console.error(err.message);

      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, err.message],
          message: "L'opération n'a pas abouti",
        })
      );
    }

    if (!parcours) {
      console.warn(
        `Impossible de trouver le parcours  -> [ID = ${condition.code}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le parcours [ID = ${condifion.code}] n'existe pas`,
        })
      );
    }

    res.status(200).json(
      apiResponse({
        data: parcours,
        status: 1,
        errors: [],
        message: MSG.HTTP_200,
      })
    );
  });
}
/* ------------------------------------------------------------------------- */

/**
 * Mettre à jour
 */
function updateParcours(req, res) {
  console.log("UPDATE recu parcours : " + req.body);

  const condition = { code: req.body.code };
  const opts = { runValidators: true, new: true };

  Parcours.findOneAndUpdate(condition, req.body, opts, (err, parcours) => {
    if (err) {
      console.error(err.message);

      return res.status(500).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_500, err.message],
          message: "L'opération n'a pas abouti",
        })
      );
    }

    if (!parcours) {
      console.warn(
        `Impossible de trouver le parcours  -> [ID = ${condifion.code}]`
      );

      return res.status(404).json(
        apiResponse({
          data: [],
          status: 0,
          errors: [MSG.HTTP_404],
          message: `Le parcours [ID = ${condifion.code}] n'existe pas`,
        })
      );
    }

    const msg = `${parcours.code} a été modifié`;

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
/* ------------------------------------------------------------------------- */

module.exports = {
  updateParcours,
  getOneParcours,
  listParcours,
  addParcours,
};
