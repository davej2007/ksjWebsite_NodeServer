const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');

router.get('/test', (req,res) =>{
    res.json({message:'from API / Auth route'});
});
router.get('/decodeToken', (req,res)=>{
    res.json(req.decoded);
});
router.post('/operatorLogIn',(req,res)=>{
    console.log(req.body);
    res.json({success:true,})
})

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