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
  const [grid, setGrid] = useState(
    Array.from({ length: 6 }, () => Array(5).fill({ letter: '', color: '' }))
  );
  const [currentrow, setcurrentrow] = useState(0);
  const [currentcol, setcurrentcol] = useState(0);
  const [wordset, setWordset] = useState(new Set());
  function buildFreqMap(str) {
            const map = new Map();
            for (let ch of str) {
              map.set(ch, (map.get(ch) || 0) + 1);
            }
            return map;
          }
const actualMap = buildFreqMap(word);
          const newRow = [];

  useEffect(() => {
    const handlekeypress = (e) => {
      if (!word) return; // don’t allow typing until word is ready

      if (/^[A-Za-z]$/.test(e.key)) {
        setBoard(prevBoard => {
          return prevBoard.map((row, i) => [...row]); // clone
        });
        setBoard(prevBoard => {
          return prevBoard.map((row, i) => {
            if (i !== currentrow) return row;
            let newRow = [...row];
            if (currentcol < 5) {
              newRow[currentcol] = e.key.toUpperCase();
            }
            return newRow;
          });
        });
        setcurrentcol(prev => (prev < 5 ? prev + 1 : prev));
      }

      if (e.key === "Backspace") {
        setBoard(prevBoard => {
          return prevBoard.map((row, i) => {
            if (i !== currentrow) return row;
            let newRow = [...row];
            if (currentcol > 0) {
              newRow[currentcol - 1] = "";
            }
            return newRow;
          });
        });
        setcurrentcol(prev => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === "Enter" && currentcol === 5) {
        const guess = board[currentrow].join("").toUpperCase();
        
        if (guess === word.toUpperCase()) {
          alert("🎉 Congratulations! You guessed the word!");
          setBoard(Array(6).fill().map(() => Array(5).fill("")));
          setcurrentrow(0);
          setcurrentcol(0);
          setClicked(false);
          actualMap.clear();
          newRow.length = 0;
          setGrid(
            Array.from({ length: 6 }, () => Array(5).fill({ letter: '', color: '' }))
          );
          setWord("");
          return;
        }
        
        if (wordset.has(guess)) {
          
          
          for (let i = 0; i < 5; i++) {
            if (guess[i] === word[i]) {
              newRow.push({ letter: guess[i], color: 'green' });
              // turn input box to green
              actualMap.set(guess[i], actualMap.get(guess[i]) - 1);// whats is this doing?
              console.log("Actual map after green ->", actualMap);
              
              // reduce frequency of that letter in map 
            }
            else {
              newRow.push({ letter: guess[i], color: '' }); // decide later
            }
          }
          
          for (let i = 0; i < 5; i++) {
            if (newRow[i].color === '' && actualMap.get(guess[i]) > 0) {
              newRow[i].color = 'yellow';
              actualMap.set(guess[i], actualMap.get(guess[i]) - 1);
            } else if (newRow[i].color === '') {
              newRow[i].color = 'grey';
            }
          }
          setGrid(prev => {
            const copy = [...prev];
            copy[currentrow] = newRow;
            return copy;
          });
          
          setcurrentrow(prev => prev + 1);
          setcurrentcol(0);
        } else {
          alert("❌ No word in the list");
        }
        if(currentrow==6){
          alert(`The word was ${word}. Better luck next time!`);
          setBoard(Array(6).fill().map(() => Array(5).fill("")));
          setcurrentrow(0);
          setcurrentcol(0);
          setClicked(false);
          actualMap.clear();
          newRow.length = 0;
          setGrid(
            Array.from({ length: 6 }, () => Array(5).fill({ letter: '', color: '' }))
          );
          setWord("");
          return;
        }
      }
    };

    window.addEventListener("keydown", handlekeypress);
    return () => window.removeEventListener("keydown", handlekeypress);
  }, [word, wordset, currentrow, currentcol]);

  useEffect(() => {
    console.log("Updated wordset ->", wordset);
  }, [wordset]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/words`);
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
  }


  const letterbox = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex justify-center ">
        {Array.from({ length: 5 }, (_, j) => (
          <input
            key={`${i}-${j}`}
            maxLength={1}
            value={board[i][j]}
            readOnly
            className="border border-gray-400 rounded-sm m-2 p-4 w-14 text-center"
            type="text"
          />
        ))}
      </div>
    ));
  };


  return (
    <div >


      <h1 className=''>Wordle Clone</h1>

      <button onClick={handlesubmit} >press to start</button>
      {
        clicked && <h2>A five letter word is assigned</h2>
      }
      <div className="flex flex-col items-center">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`m-2 p-4 w-14 text-center border rounded-sm
            ${grid[i][j].color === 'green' ? 'bg-green-500 text-white' :
                    grid[i][j].color === 'yellow' ? 'bg-yellow-500 text-white' :
                      grid[i][j].color === 'grey' ? 'bg-gray-400 text-white' : ''}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
