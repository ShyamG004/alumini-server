const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    company_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    job_role: { type: String, required: true },
    job_description: { type: String, required: true },
    skillset_required: { type: [String], required: true },
    expected_ctc: { type: String, required: true },
  });
  
  const Company = mongoose.model("Company", companySchema);
module.exports= Company;
