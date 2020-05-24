const express = require('express');
const router  = express.Router();
const AUCTION = require('../models/auctions');
const fs = require('fs');

router.get('/readDatabase', (req,res) =>{
    AUCTION.find().exec(function(err,auctions){
        if(err){
            console.log(err)
        } else {
            console.log(auctions)
            fs.writeFile ("auctions.json", JSON.stringify(auctions), function(err) {
                if (err) throw err;
                res.json({message:'from API / ReadDataBase', auctions});
                }
            );
        }
    })
});
router.get('/writeDatabase', (req,res) =>{
    fs.readFile("auctions.json",function(err,data){
        if(err) throw err;
        var auctions = JSON.parse(data);
        auctions.forEach(auc => {
            auction = new AUCTION(auc)
            auction.save((err)=>{
                if (err) {
                    res.status(401).send({ message: 'DB Error : ' + err });
                } else {
                    console.log(auction)
                }
            });
        });
        res.send('finished')
    });
})

module.exports = router;