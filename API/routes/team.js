const express = require('express');
const router  = express.Router();
const TEAM = require('../models/team');

router.get('/test', (req,res) =>{
    res.send('from API / TEAM route');
});
router.post('/checkTeamName', (req,res)=>{
    console.log(req.body)
    if (req.body.teamName == null || req.body.teamName == '') {
        res.json({success:false, message: 'No Team Name Entered' });
    } else {
        TEAM.findOne({teamID:req.body.teamName}).select('_id').exec((err,team)=>{
            if(err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if(!team){
                    res.json({success:true, message:'Team Name OK'});
                } else {
                    res.json({success:false, message:'Team Name Already In Use'})
                }
            }
        })
    }

});
router.get('/getAllParties', (req,res)=>{
    PARTY.find().exec((err,party)=>{
        if(err) {
            res.status(401).send({ message: 'DB Error : ' + err });
        } else {
            if(party.length==0){
                res.json({success:false, message:'Parties Not Found'});
            } else {
                res.json({success:true, message:'Party ID Found', party })
            }
        }
    })
})

// Create New Party/event
router.post('/createNewParty', (req,res)=>{ 
    if (req.body.partyID == null || req.body.partyID == '') {
        res.json({success:false, message: 'No Party ID Entered' });
    } else if (req.body.hostName == null || req.body.hostName == '') {
        res.json({success:false, message: 'No Host Name Entered' });
    } else if (req.body.date == null || req.body.date == '') {
        res.json({success:false, message: 'No Date Entered' });
    } else if (req.body.venue == null || req.body.venue == '') {
        res.json({success:false, message: 'No Venue Entered' });
    } else {
        var party = new PARTY({
            partyID:req.body.partyID,
            hostName:req.body.hostName,
            title:req.body.title,            
            date: req.body.date,
            startTime:req.body.startTime,
            duration:req.body.duration,
            venue:req.body.venue,
            type:req.body.type,
            messageScreens: req.body.messageScreens,
            songBook:req.body.songBook
        });
        party.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, party: party });
            }
        });
    }
});

module.exports = router;