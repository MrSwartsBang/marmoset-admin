const express = require('express');
const router = express.Router();
const About = require('../../models/About');


router.get('/about-data', (req, res) => {
    About.find({}).sort({date:-1}).then(data => {
        console.log(data);
        if (data) {
            return res.status(200).send(data);
        }
    });
});
router.get('/about-data-one', (req, res) => {
    About.findOne({}).sort({date:-1}).then(data => {
        console.log(data);
        if (data) {
            return res.status(200).send(data);
        }
    });
});
router.post('/about-add', (req, res) => {
    console.log(req.body);
    const about = new About(req.body);
    about
        .save()
        .then(about => {
            console.log(about);
            return res.status(200).json({message: 'About added successfully. Refreshing data...'})
        }).catch(err => console.log(err));
});

router.post('/about-update', (req, res) => {
    const _id = req.body._id;
    console.log(req.body);
    About.findOneAndUpdate({_id},req.body).then(data => {
        if (data) {
            return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.post('/about-delete', (req, res) => {
    About.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'About deleted successfully. Refreshing data...', success: true})
        }
    });
});


module.exports = router;
