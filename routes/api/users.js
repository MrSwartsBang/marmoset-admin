const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateUpdateUserInput = require('../../validation/updateUser');
const Verified = require('../../models/Verified');
const isEmpty = require("is-empty");
const {VerifiCode} = require("../../utils/marmosetUtils");
const {checkNFTowner} = require("../../utils/discordbot");
router.post('/user-data', async (req, res) => {
    try {
      const users = await Verified.find({});
      if (users) {
        const userList = await Promise.all(users.map(async (ui) => {
          return {
            discord: ui.discord,
            telegram: ui.telegram,
            wallet: ui.wallet,
            nftCount: await checkNFTowner(ui.wallet)
          };
        }));
        console.log(userList);
        return res.status(200).send(userList);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  });
  

router.post('/user-delete', (req, res) => {
    Verified.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'user deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/user-update', (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Verified.findOne({ _id }).then(user => {
        if (user) {
            if (req.body.password !== '') {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                    });
                });
            }
            let update = {'name': req.body.name, 'email': req.body.email, 'password': user.password};
            Verified.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update user.' });
                } else {
                    return res.status(200).json({ message: 'user updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});

router.post('/user-verify', (req, res) => {
  
    const {discord,telegram,wallet} = req.body;
    console.log(req.body);
    for(each in req.body){
        if(isEmpty(req.body[each])) req.body[each] = undefined;
    }
 
    if(!isEmpty(wallet))
    Verified.findOne({ wallet }).then((result)=>{
        if(!result)
        Verified.create(req.body).then((createResult)=>{
            const {discord,telegram} = createResult;
            res.status(200).json({message:"You are successfully verified.",flg:"success",discord,telegram});
        });
        else
        {
            Verified.findByIdAndUpdate(result._id, req.body,{ new: true })
            .then((ttt) => {
                const {discord,telegram} = ttt;
              res.status(200).json({message: "The wallet is already verified. Your info has been updated.", flg: "error",discord,telegram});
            })
            .catch((error) => {
              res.status(500).json({message: "An error occurred while updating your information. Please try again later.", flg: "error"});
            });
        }

    });
});
router.post('/getUserByWallet', (req, res) => {
    const {wallet} = req.body;
    if(!isEmpty(wallet))
    Verified.findOne({ wallet }).then((result)=>{
        const resData = result? {message:"You already have been verified.",flg:true}
                            :{message:"You are not verified yet. Get the verification code",flg:false};
        res.status(200).json(resData);
    });
});

router.post('/get-verifiCode', (req, res) => {
    var code = VerifiCode.create(req.body);
    res.json(code);
});
module.exports = router;

