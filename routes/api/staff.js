const express = require('express');
const router = express.Router();
const Staff = require('../../models/Staff');
const multer = require('multer');
const db = require('../../config/keys').mongoURI;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const filename = `${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;
        cb(null, filename);
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/staff-add',upload.single('file'), (req, res) => {
    if(req.file)
    req.body.img = req.file.path;
    const newStaff = new Staff(req.body);
        newStaff
            .save()
            .then(staff => {
                console.log(staff);
                return res.status(200).json({message: 'Staff added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
});


router.get(['/staff-data'], (req, res) => {
    // console.log("=/staff-data");
    Staff.find({}).sort({date:-1}).then(car => {
        if (car) {
            return res.status(200).json(car);
        }
    });
});

router.post('/staff-update',upload.single('file'),(req, res) => {
    const _id = req.body._id;

    Staff.findOneAndUpdate({_id},req.body).then(data => {
        if (data) {
            return res.status(200).json({ message: 'Staff updated successfully. Refreshing data...', success: true });
        } else {
            return res.status(400).json({ message: 'Now staff found to update.' });
        }
    });
});

router.post('/staff-delete', (req, res) => {
    Staff.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'Staff deleted successfully. Refreshing data...', success: true})
        }
    });
});

module.exports = router;