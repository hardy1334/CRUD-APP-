 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

require('/home/hardik/Node js Project/vidjot/views/models/Idea');
const Idea = mongoose.model('ideas');


module.exports = router;


router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add')
});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
   .then(idea =>{
       if(idea.user != req.user.id){
           res.redirect('/ideas');
       }
    else{
        res.render('ideas/edit',{
            idea: idea
        });
    }
   });
});

router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user: req.user.id })
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index',{
        ideas: ideas
        });
    }) ;
})

router.post('/',ensureAuthenticated,(req,res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'Please add a title '})
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details '})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
      new Idea(newUser)
      .save()
      .then(idea => {
         
          res.redirect('/ideas');
      })
    }
});



router.put('/:id',ensureAuthenticated,(req,res) => {
  Idea.findOne({
      _id: req.params.id
  }) 
  .then(idea =>{
     idea.title = req.body.title;
     idea.details = req.body.details;

     idea.save()
     .then(idea =>{
        res.flash('success _msg','Video Idea added');
         res.redirect('/ideas');
     })
  })
})

router.delete('/:id',ensureAuthenticated,(req,res)=>{
     Idea.remove({_id: req.params.id})
     .then(()=>{
         req.flash('success_msg','Video idea removed');
         res.redirect('/ideas');
     });
}); 