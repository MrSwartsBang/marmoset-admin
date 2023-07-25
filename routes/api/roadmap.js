const express = require('express');
const router = express.Router();
const Roadmap = require('../../models/Roadmap');

router.get('/roadmap-data', (req, res) => {
    Roadmap.find({}).sort({createdAt:-1}).then(data => {
        console.log('/roadmap-data',data);
        if (data) {
            return res.status(200).send(data);
        }
    });
});
router.get('/roadmap-data-one', (req, res) => {
    Roadmap.findOne({}).sort({createdAt:-1}).then(data => {
        // console.log(data);
        if (data) {
            return res.status(200).send(data);
        }
    });
});
router.post('/roadmap-add', (req, res) => {
    const roadmap = new Roadmap(req.body);
    roadmap
        .save()
        .then(roadmap => {
            return res.status(200).json({message: 'roadmap added successfully. Refreshing data...'})
        }).catch(err => console.log(err));
});

router.patch('/roadmap-update', (req, res) => {
    const _id = req.body._id;
    console.log(req.body);
    
    Roadmap.findByIdAndUpdate(_id,req.body,{new:true}).then(data => {
        if (data) {
            return res.status(200).json({ message: 'roadmap updated successfully. Refreshing data...', success: true });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.delete('/roadmap-delete/:id', (req, res) => {
    const {id} = req.params;
    Roadmap.findByIdAndDelete(id).then(user => {
        if (user) {
            return res.status(200).json({message: 'roadmap deleted successfully. Refreshing data...', success: true})
        }
    });
});


module.exports = router;
