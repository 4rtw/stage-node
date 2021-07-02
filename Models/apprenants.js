let mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let apprenantsSchema = Schema({
  matricule: {
    type: Number,
    required: [true, "Champ requis"],
    unique: true,
  },
  nom: {
    type: String,
    required: [true, "Champ requis"],
  },
  prenom: {
    type: String,
    required: [true, "Champ requis"],
  },
  telephone: {
    type: String,
    required: [true, "Champ requis"],
  },
  adresse: {
    type: String,
    required: [true, "Champ requis"],
  },
  email: {
    type: String,
    required: [true, "Champ requis"],
  },
  contacts_Tuteur_Parent: {
    type: [String],
  },
  parcours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parcours",
  },
});

apprenantsSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("apprenants", apprenantsSchema);
