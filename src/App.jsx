import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [word, setWord] = useState('');
  const [clicked, setClicked] = useState(false);
  const [board, setBoard] = useState(
    Array(6).fill().map(() => {
      return Array(5).fill("");
    })
  )
  const [currentrow, setcurrentrow] = useState(0);
  const [currentcol, setcurrentcol] = useState(0);
  const [wordset, setWordset] = useState(new Set());
  useEffect(() => {
    const handlekeypress = (e) => {
      if (/^[A-Za-z]$/.test(e.key) && currentcol < 5) { // Check if the key is a letter
        const newboard = board.map((row) => [...row]);
        console.log(newboard);
        newboard[currentrow][currentcol] = e.key.toUpperCase();
        setBoard(newboard);
        setcurrentcol(currentcol + 1);
      }

      if (e.key === "Backspace" && currentcol > 0) {
        const newboard = board.map((row) => [...row]);
        newboard[currentrow][currentcol - 1] = "";
        setBoard(newboard);
        setcurrentcol(currentcol - 1);
      }

      if (e.key === "Enter" && currentcol === 5) {
        if (word.toLowerCase() === board[currentrow].join("").toLowerCase()) {
          alert("Congratulations! You guessed the word!");
          setcurrentrow(0);
          setcurrentcol(0);
          setClicked(false);
          setWord("");
          setBoard(
            Array(6).fill().map(() => {
              return Array(5).fill("");
            })
          );
          return;
        }
        if (wordset.has(board[currentrow].join("").toLowerCase())) {
          setcurrentrow(currentrow + 1);
          setcurrentcol(0);

        }
        else {
          alert("Word not found");
        }
      }
    }
    window.addEventListener("keydown", handlekeypress);
    return () => window.removeEventListener("keydown", handlekeypress);
  }, [wordset, currentcol, currentrow, board]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch('http://localhost:3000/words');
        const data = await res.json();
        setWordset(new Set(data));
        console.log("Data fetched ->", data);
        if (clicked) {
          setWord(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (error) {
        console.error("Error fetching word:", error);
      }
    };

    fetchWord();
  }, [clicked]);


  function handlesubmit() {
    setClicked(true);
    console.log("Button clicked");
  }


  const letterbox = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex justify-center ">
        {Array.from({ length: 5 }, (_, j) => (
          <input
            key={`${i}-${j}`}
            maxLength={1}
            className="border border-gray-400 rounded-sm m-2 p-4 w-14 text-center"
            type="text"
          />
        ))}
      </div>
    ));
  };


  return (
    <div >


      <h1>Wordle Clone</h1>

      <button onClick={handlesubmit} >press to start</button>
      {
        clicked && <h2>The word is {word} </h2>
      }
      <div className='flex flex-col items-center justify-center'>
        {letterbox()}
      </div>

    </div>
  );
}

export default App;
