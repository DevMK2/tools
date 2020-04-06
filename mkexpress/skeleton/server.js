const PORT = 3000;

const express = require('express')
    , app = express()

app.use(express.static('static'));
app.engine('html', require('ejs').renderFile);
app.listen(PORT, ()=>console.log(`App listening on port ${PORT}`));

app.get('/', (req, res)=>{
  res.render('index.html');
});
