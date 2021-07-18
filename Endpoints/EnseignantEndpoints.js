const enseignant = require("../Routes/EnseignantsRoutes");
require('dotenv').config()
function apiEnseignant(app) {
    const prefix = process.env.PREFIX
    app.route(prefix + "/enseignants").get(enseignant.getEnseignants);

    app
        .route(prefix + "/enseignant/:id")
        .get(enseignant.getEnseignant)
        .delete(enseignant.deleteEnseignant);

    app.route(prefix + "/enseignants/search").get(enseignant.searchEnseignants);

    app
        .route(prefix + "/enseignant")
        .post(enseignant.postEnseignant)
        .put(enseignant.updateEnseignant);
}

module.exports = {apiEnseignant}
