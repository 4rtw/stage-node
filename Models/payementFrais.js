let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let payementSchema = Schema({
  idPayement: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  typePayement: {
    type: String,
    required: [true, "Champ requis"],
  },

  idInscription: {
    type: Number,
    required: [true, "Champ requis"],
  },

  datePayement: {
    type: String,
    required: [true, "Champ requis"],
  },

  montant: {
    type: Number,
    required: [true, "Champ requis"],
  },

  mensualites: {
    type: [String],
    required: [true, "Champ requis"],
  },

  periode: {
    type: Number,
    required: [true, "Champ requis"],
  },

  payeePar: {
    type: String,
    required: [true, "Champ requis"],
  },
});

module.exports = mongoose.model("fraisDeFormation", payementSchema);
