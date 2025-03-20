const express = require('express');
const cors = require('cors');
const path = require('path');
const axios=require('axios');
const qs = require('qs');
const multer = require('multer');
const connectDB = require('./config/db');
const FormData = require('./model/form');
const Company = require('./model/companySchema')
const {sendAcknowledgeEmail}=require('./service/emailService');

require('dotenv').config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: 'https://alumni-job-form.vercel.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, 
}));
// Serve the favicon
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
app.use('/favicon.ico', express.static(faviconPath));

const buildPath = path.join(__dirname, '../build');
app.use(express.static(buildPath));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});


app.post("/api/submitFormData", upload.single('attachment'), async (req, res) => {
    const {
      name,
      email,
      contact,
      batch,
      location,
      skillset,
      company,
      experience,
      ctc,
      message,
    } = req.body;
  
    try {
      const token=(await FormData.find()).length+1;
      const tokenNo=String(token).padStart(3,'0');
      await FormData.insertMany({
        tokenNo,
        name,
        email,
        contact,
        batch,
        location,
        skillset,
        company,
        experience,
        ctc,
        message,
        attachment: req.file ? req.file.path : null 
      });
      //console.log(req.file);
      await sendAcknowledgeEmail(tokenNo,name,email,contact,batch,location,skillset,company,experience,ctc,message,req.file?req.file.filename:null,req.file ? req.file.path : null );
      res.status(201).json({ message: 'Form data saved successfully' });
    } catch (err) {
      console.error('Error saving form data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/verifycaptcha",async(req,res)=>{
      const {value}=req.body;
      //console.log(value);
      //console.log(process.env.MONGO_URI);
      try{
            const google_res=await axios.post("https://www.google.com/recaptcha/api/siteverify",
              qs.stringify({
                secret: process.env.SECRET_KEY,
                response: value,
              }),{
              headers:{
                "Content-Type":"application/x-www-form-urlencoded"
              }
            })
            const {data}=await google_res;
            //console.log(data);
            if(data.success===true){
              res.status(201).json({ message: 'Captcha Success' });
            }
            else{
              res.status(201).json({ message: 'Captcha Failed' });
            }
    
      }
      catch (err) {
        console.error('Error saving form data:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
  })
  
app.get('/api/job-details/:trackingId', async (req, res) => {
    try {
        const jobDetails = await FormData.findOne({ tokenNo: req.params.trackingId });
        if (!jobDetails) return res.status(404).json({ message: 'No record found' });
        res.json(jobDetails);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update job details endpoint
app.put('/api/update-details/:trackingId', async (req, res) => {
  try {
      const updatedJob = await FormData.findOneAndUpdate(
          { tokenNo: req.params.trackingId },
          req.body,
          { new: true }
      );
      
      if (!updatedJob) return res.status(404).json({ message: 'No record found' });
      res.json(updatedJob);
  } catch (error) {
      console.error('Error updating job details:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Delete account endpoint
app.delete('/api/delete-account/:trackingId', async (req, res) => {
  try {
      const deletedJob = await FormData.findOneAndDelete({ tokenNo: req.params.trackingId });
      
      if (!deletedJob) return res.status(404).json({ message: 'No record found' });
      res.json({ message: 'Account deleted successfully' });
  } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update resume endpoint
app.post('/api/update-resume/:trackingId', upload.single('resume'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const resumePath = req.file.path;
      
      const updatedJob = await FormData.findOneAndUpdate(
          { tokenNo: req.params.trackingId },
          { attachment: resumePath },
          { new: true }
      );
      
      if (!updatedJob) return res.status(404).json({ message: 'No record found' });
      res.json({ message: 'Resume updated successfully' });
  } catch (error) {
      console.error('Error updating resume:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
app.post("/companies", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json({ message: "Company added successfully", company: newCompany });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/companies/:id", async (req, res) => {
  try {
    const company = await Company.findOne({ company_id: req.params.id });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(5000, () => {
    console.log("Listening on port 5000");
});
