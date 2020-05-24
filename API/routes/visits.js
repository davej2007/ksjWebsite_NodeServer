const express = require('express');
const router  = express.Router();
const VISIT = require('../models/visits');

router.get('/getVisitsInfo', (req,res)=>{
    VISIT.find().exec(function(err,visits){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!visits){
                res.json({ success:false, message:'Visits Not Found.' });
            } else {
                res.json({ success:true, visits});
            }
        }
    });
});
router.get('/getBinDateInfo', (req,res)=>{
    VISIT.find({type:3}).exec(function(err,visits){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!visits){
                res.json({ success:false, message:'Visits Not Found.' });
            } else {
                res.json({ success:true, visits});
            }
        }
    });
});
router.post('/getVisitInfoById', (req,res)=>{
    if(!req.body.id){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        VISIT.findById(req.body.id).exec(function(err,visit){
            if (err) {
                res.json({ success:false, message:'DB Error : ' + err });
            } else {
                if (!visit){
                    res.json({ success:false, message:'Visits Not Found.' });
                } else {
                    res.json({ success:true, visit});
                }
            }
        });
    }    
});
router.post('/saveNewVisits', (req,res)=>{
    if(!req.body.date){
        res.json({ success:false, message: 'No Date Supplied' });
    } else if(!req.body.type){
        res.json({ success:false, message: 'No Type Supplied' });
    } else {
        var visit = new VISIT({
            date    : req.body.date,
            type    : req.body.type,
            home    : { by      : req.body.person || 'n/a',
                        checks  : { water   : req.body.water || false,
                                    windows : req.body.windows || false,
                                    doors   : req.body.doors || false },
                        comments: req.body.comments || 'n/a' },
            agent   : { time    : req.body.time || 'n/a',
                        name    : req.body.name || 'n/a',
                        feedback: req.body.feedback || 'n/a' },
            bins    : { type    : req.body.bins || 'n/a',
                        used    : req.body.binsUsed || true }
        })
        visit.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, message :'New visit Created ......', visit });
            }
        });
    }
});
router.post('/updateVisitInfoById', (req,res)=>{
    if(!req.body.id){
        res.json({ success:false, message: 'No ID Supplied' });
    } else if(!req.body.visit.date){
        res.json({ success:false, message: 'No Date Supplied' });
    } else if(!req.body.visit.type){
        res.json({ success:false, message: 'No Type Supplied' });
    } else {
        VISIT.findById(req.body.id).exec(function(err,visit){
            if (err) {
                res.json({ success:false, message:'DB Error : ' + err });
            } else {
                if (!visit){
                    res.json({ success:false, message:'Visits Not Found.' });
                } else {
                    visit.date = req.body.visit.date;
                    console.log(visit)
                    if(req.body.visit.type == 1){
                        console.log('type 1', req.body)
                        visit.home.by            = req.body.visit.person;
                        visit.home.checks.water  = req.body.visit.water;
                        visit.home.checks.windows= req.body.visit.windows;
                        visit.home.checks.doors  = req.body.visit.doors;
                        visit.home.comments      = req.body.visit.comments;
                    }
                    if(req.body.visit.type == 2){
                        console.log('type 2', req.body)
                        visit.agent.time = req.body.visit.time;
                        visit.agent.name = req.body.visit.name;
                        visit.agent.feedback = req.body.visit.feedback;
                    }
                    if(req.body.visit.type == 3){
                        console.log('type 3', req.body)
                        // bins    : { type    : req.body.bins || 'n/a',
                        // used    : req.body.binsUsed || true }
                    }
                    visit.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Visit Updated ......', visit });
                        }
                    });
                }
            }
        });
    }
});
router.post('/deleteVisitInfoById', (req,res)=>{
    console.log(req.body.id)
    if(!req.body.id){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        VISIT.findByIdAndDelete(req.body.id).exec((err, visit)=>{
            if(err){
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, message :'Visit Deleted ......', visit });
            }
        })
    }
});
module.exports = router;