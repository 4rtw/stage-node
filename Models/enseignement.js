const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enseignementSchema = Schema({
  idEnseignement: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  matriculeEnseignant: {
    type: Number,
    required: [true, "Champ requis"],
  },

  matriculePointeur: {
    type: Number,
    required: [true, "Champ requis"],
  },

  idEC: {
    type: Number,
    required: [true, "Champ requis"],
  },

  sujetCours: {
    type: String,
    required: [true, "Champ requis"],
  },

  classe: {
    type: {
      periode: Number,
      niveau: String,
      idParcours: [Number],
    },
    required: [true, "Champ requis"],
  },

  heureDebut: {
    type: String,
    required: [true, "Champ requis"],
  },

  heureFin: {
    type: String,
  },

  volume: {
    type: {
      heures: Number,
      minutes: Number,
    }
  },

  cloture: {
    type: Boolean
  },

  remarques: {
    type: {
      retard: String,
      absence: String,
      autres: String,
    },
  },
});

module.exports = mongoose.model("enseignements", enseignementSchema);
