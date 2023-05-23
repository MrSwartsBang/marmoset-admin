const express = require('express');
const router = express.Router();
const Staff = require('../../models/Staff');
const multer = require('multer');
const db = require('../../config/keys').mongoURI;
const {GridFsStorage} = require('multer-gridfs-storage');
// Create the GridFS storage engine
const storage = new GridFsStorage({
  url: db, // MongoDB connection URL
  file: (req, file) => {
    return {
      filename: file.originalname // Set the filename to the original name of the file
    };
  }
});
// Create the Multer instance with the GridFS storage engine
const upload = multer({ storage });

router.post('/staff-add',upload.single('file'), (req, res) => {
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