let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let facturationSchema = Schema({
  idFacture: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  details: {
    type: {
      idEnseignant: Number,
      periode: Number,
      mois: String,
    },
    required: [true, "Champ requis"],
    unique: true,
  },

  enseignements: {
    type: {
      idEnseignement: Number,
      montant: Number,
    },
  },

  cloture: {
    type: Boolean,
    required: [true, "Champ requis"],
  },
});

module.exports = mongoose.model("facturation", facturationSchema);
