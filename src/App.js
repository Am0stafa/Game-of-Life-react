import React,{useState} from 'react'
import produce from 'immer';

//we represent the cell to be either 0 means dead and 1 means alive
export default function App() {
const numOfRows = 50;
const numOfCols = 50;

//create the grid
  const [grid, setGrid] = useState(()=>{
    const rows = [];
    //! we cant use forEach as the array is initaly empty
    // rows.forEach(row =>{
    //   row.push(Array.from(Array(numOfCols),()=>0))
    // })
    for(let i = 0; i < numOfCols;i++){
      rows.push(Array.from(Array(numOfCols),()=>0))
   }
    
    
    return rows;
  }) 
 //store whether we started or not
 const [running,setRunning] = useState(false)
  

  
  return (
  <>
    <button
      onClick={() => setRunning(prev=>{return !prev})}
    >{!running?'start':'stop'}
    </button>
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns:`repeat(${numOfCols},22px)`,
      }}
    >
      {grid.map((row,rid) => row.map((col,cid)=> <div 
      key={`${rid}-${cid}`}
      style={{width:20, height:20,
      backgroundColor:grid[rid][cid]?'pink':undefined,
      border:"solid 1px black"
      }}
      onClick={()=>{
        setGrid(produce(grid, copygrid=>{
          copygrid[rid][cid] =grid[rid][cid]? 0:1 ;
        }))
      }}
      ></div>))}
    </div>
  </>
  )
}
