const express = require('express')
const connectDB = require('./db');
connectDB();
const app = express()
const port = 3000
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/health',(req,res)=>{
    res.status(200).json({message:"Everything is working Fine"});
})

app.use('/api/v1/auth',require('./routes/auth'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})