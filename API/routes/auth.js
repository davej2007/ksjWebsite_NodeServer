const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const OPERATOR = require('../models/operator');

router.get('/test', (req,res) =>{
    res.json({message:'from API / Auth route'});
});
router.get('/decodeToken', (req,res)=>{
    res.json(req.decoded);
});
// Operator Log In
router.post('/operatorLogIn',(req,res)=>{
    if (req.body.userID == null || req.body.UserID == '') {
        res.json({success:false, message: 'No User Identification Entered' });
    } else if (req.body.password == null || req.body.password == '') {
        res.json({success:false, message: 'No Password Entered' });
    } else {
        OPERATOR.findOne({userID:req.body.userID})
            .select('_id userID name password admin')
            .exec(function(err,operator){
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    if (!operator){
                        res.json({success:false, message: 'Invalid Operator User ID !' });
                    } else {
                        let validPassword = operator.comparePassword(req.body.password);
                        if (!validPassword){
                            res.json({success:false, message: 'Invalid Password' }); 
                        } else {
                            // create web token
                            let Json = {
                                operator_id:operator._id,
                                operatorID:operator.userID,
                                operatorname:operator.name,
                                team_id:null,
                                teamID:null,
                                teamName:null,
                                admin:operator.admin } 
                            let token = jwt.sign(Json, config.tokenKey );
                            res.json({success:true, token:token, operator:operator.name, message: 'Success' });
                        }
                    }
                }
            }
        );
    }
});





router.post('/initilizeLocalTokens', (req,res)=>{
    if(req.body.Initilize == null || req.body.Initilize == undefined){
        res.status(401).json({message:'No Body Selected'});
    } else {
        if(!admin[req.body.Initilize]){
            res.json({success:false, error:'Not Valid User'})
        } else {
            let token = jwt.sign({ user:req.body.Initilize, admin:admin[req.body.Initilize] }, key);
            res.json({success:true, token:token, user:req.body.Initilize})
        }
    }
})

module.exports = router;