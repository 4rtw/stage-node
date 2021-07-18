const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const enseignantsSchema = Schema({
  matricule: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },

  nom: {
    type: String,
    required: [true, "Champ requis"],
  },

  prenoms: {
    type: String,
    required: [true, "Champ requis"],
  },

  naissance: {
    type: {
      date: String,
      lieu: String,
      sexe: String,
    },
    required: [true, "Champ requis"],
  },

  telephones: {
    type: [String],
    required: [true, "Champ requis"],
  },

  email: {
    type: String,
    required: [true, "Champ requis"],
  },

  photoUrl: {
    type: String,
  },

  cvUrl: {
    type: String,
  },

  actif: {
    type: Boolean,
    required: [true, "Champ requis"],
  },

  password: {
    type: String,
    required: [true, "Champ requis"],
  },
});

enseignantsSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("enseignants", enseignantsSchema);
