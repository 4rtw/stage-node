const fraisScolarite = require("../Routes/PayementFraisRoutes");
require("dotenv").config();
function apiFrais(app) {
  const prefix = process.env.PREFIX;
  app
    .route(prefix + "/frais-scolarite")
    .get(fraisScolarite.getPayementsFraisByPeriodeAndInsciption);

  app
    .route(prefix + "/frais-scolarite/:id")
    .get(fraisScolarite.getPayementFrais)
    .delete(fraisScolarite.deletePayementFrais);

  app.route(prefix + "/frais-scolarite").post(fraisScolarite.postPayementFrais);
}

module.exports = { apiFrais };
