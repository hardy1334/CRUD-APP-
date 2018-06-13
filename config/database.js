if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 
    'mongodb://hardy:hardychugh9@ds159020.mlab.com:59020/vidjot'
}
}
else{
  module.exports={
      mongoURI:
      'mongodb://localhost/vidjot-dev'
  }
}