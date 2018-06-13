const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require ('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const db = require('./config/database');


mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI,{
 
})
  .then(()=> { console.log('Mongodb Connected..........')}) 
  .catch(err=>{console.log('err')})

  
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

  app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

  app.use(passport.initialize());
  app.use(passport.session());

app.use(flash());

//global variables

app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
   res.locals.success_msg = req.flash('success message');      
   res.locals.error_msg = req.flash('error message');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));


app.use((req,res,next)=>{
   // console.log(Date.now());
   //req.name= 'Hardik';
    next();
});

const port = process.env.PORT || 5000;


app.get('/',(req,res)=>{
   const title= 'Welcome to home page'
    res.render('index',{
        title: title
    });
});


app.use('/ideas',ideas);
app.use('/users',users);

app.get('/about' ,(req,res)=>{
    res.render('about');
    //console.log(req.name);
});
app.listen(port,()=>{
    console.log(`server started at port ${port}`);
}); 