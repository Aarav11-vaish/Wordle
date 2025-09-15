import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.get('/words', async (req, res) => {
  try {
    const fetchdata = await fetch(process.env.API_URL);
    const data = await fetchdata.json();
    res.json(data);
  } catch (e) {
    console.error("Error ->", e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
