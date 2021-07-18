let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let enseignementSchema = Schema({
  idEnseignement: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  idEC: {
    type: Number,
    required: [true, "Champ requis"],
  },

  details: {
    type: {
      matriculeEnseignant: Number,
      heureDebut: Number,
      minutesDebut: Number,
      heureFin: Number,
      minFin: Number,
      periode: Number,
      mois: Number,
      jour: Number,
    },
    required: [true, "Champ requis"],
    unique: true,
  },

  remarques: {
    type: {
      retard: String,
      absence: String,
    },
  },
});

module.exports = mongoose.model("facturation", enseignementSchema);
