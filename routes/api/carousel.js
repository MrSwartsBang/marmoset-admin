const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUpdateUserInput = require('../../validation/updateUser');
const Carousel = require('../../models/Carousel');

router.post(['/carousel-add'], (req, res) => {
  
    const newCarousel = new Carousel(req.body);
        newCarousel
            .save()
            .then(carousel => {
                console.log(carousel);
                return res.status(200).json({message: 'Carousel added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
});

router.post(['/carousel-data'], (req, res) => {
    Carousel.find({}).sort({date:-1}).then(car => {
        if (car) {
            return res.status(200).json(car);
        }
    });
});

router.post('/carousel-update', (req, res) => {
    const _id = req.body._id;

    Carousel.findOneAndUpdate({_id},req.body).then(data => {
        if (data) {
            return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.post('/carousel-delete', (req, res) => {
    Carousel.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'Carousel deleted successfully. Refreshing data...', success: true})
        }
    });
});

module.exports = router;