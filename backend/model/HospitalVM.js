var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HospitalVM = new Schema({
  IP: String,
  name: String
}, {
  versionKey: false
});

module.exports = mongoose.model('HospitalVM', HospitalVM);
