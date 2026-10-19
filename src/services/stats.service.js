const KelasModel = require("../models/kelas.model");

module.exports = {
  async getSummary() {
    return { totalKelas: await KelasModel.countKelas() };
  }
};
