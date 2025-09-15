import expess from 'express';
import cors from 'cors';
const app = expess();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/words', async (req, res)=>{
    try{
const fetchdata = await fetch('https://api.frontendexpert.io/api/fe/wordle-words');
const data = await fetchdata.json();
res.json(data);

    }
    catch(e){
        console.log("Error -> ", e);
    }

});
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});