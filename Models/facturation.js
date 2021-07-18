const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facturationSchema = Schema({
  idFacture: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  details: {
    type: {
      idEnseignant: Number,
      periode: Number,
      mois: Number,
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

  idEnseignant: {
    type: Number,
    required: [true, "Champ requis"],
  },

  activite: {
    type: { periode: Number, mois: Number },
    required: [true, "Champ requis"],
  },
});

module.exports = mongoose.model("facturation", facturationSchema);
