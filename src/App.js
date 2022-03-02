import React,{useState,useCallback,useRef} from 'react'
import produce from 'immer';

//we represent the cell to be either 0 means dead and 1 means alive
export default function App() {
const numOfRows = 50;
const numOfCols = 50;

 //! instead of multple cases

const operations = [
//[i,k] how many to move left and write (pic)
      [0,1],
      [0,-1],
      [1,-1],
      [-1,1],
      [1,1],
      [-1,-1],
      [1,0],
      [-1,0]
];

const generateEmptyGrid =()=>{

  const rows = [];
  //! we cant use forEach as the array is initaly empty

  for(let i = 0; i < numOfCols;i++){
    rows.push(Array.from(Array(numOfCols),()=>0))
 }

  return rows;

}
const randomGen =()=>{

  const rows = [];
  for(let i = 0; i < numOfCols;i++){
    rows.push(Array.from(new Array(numOfCols),()=>Math.random()<0.7?0:1))
 }

  return setGrid(rows);

}

//create the grid
  const [grid, setGrid] = useState(()=>{
    return generateEmptyGrid();
  }) 
  
  
  
 //store whether we started or not
 const [running,setRunning] = useState(false)
 
 //so that running will be always uptodate when calling callbacks
 //! whenever we need to use a current value inside a callback this is a must
 const runningRef = useRef(running);
 runningRef.current = running;
 
//this function will start the simulation
//we want this function to run only once so we wrap it inside useCallback
const runSimulation = useCallback(() =>{
//we will keep running through the entire grid and we do all the rules for each one
  if(!runningRef.current){
    return;
  }
  //! now we can do any type of mutation on the grid copy and it is going to update that state
  setGrid((Ogrid)=>{        
    return produce(Ogrid, copygrid=>{
      for(let i =0; i<numOfRows; i++){
        for(let k=0; k<numOfCols; k++){
            //* compute the number of neighbors
            let neighbors =0;
            operations.forEach(([x,y])=>{
                const newI = i+x;
                const newK = k+y;
                //& bound cases
                if(newI >=0 && newK >=0 && newI < numOfRows && newK < numOfCols) {
                  //& if alive add one
                  //? HERE WE WANT TO COMPARE TO THE PERIVOUS STATE
                  if(Ogrid[newI][newK])
                    neighbors++;
                }
            })
            //* now we have the number of neighbors
            
            //? Rule 1 && 2
            if(neighbors < 2 || neighbors > 3)
              copygrid[i][k] = 0;
            //? Rule 3
            else if(copygrid[i][k] === 0 && neighbors ===3)
              copygrid[i][k] = 1;
            
            //? Rule 4
            
        
        }
      }
      
      
      
    })
})
  
  
  
  setTimeout(runSimulation,500)

},[])


  
  return (
  <>
    <button
      onClick={() =>{ 
      setRunning(prev=>{return !prev})
        if(!running){
          runningRef.current = true;
          runSimulation()
        }
      }}
    >
    {!running?'Start':'Stop'}
    </button>
    <button
      onClick={() =>{
      setGrid(generateEmptyGrid())
      }}
    >
      Clear
    </button>
    <button
      onClick={() =>{
        randomGen()
      }}
    >
      Random
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
      //we do all changes to the grid copy then it will reflect on the state
      onClick={()=>{
        setGrid((Ogrid)=>{        
            return produce(Ogrid, copygrid=>{
            //we want to make it zero or one and to switch between them we did that by switching between the old state
              copygrid[rid][cid] = Ogrid[rid][cid]? 0:1 ;
            })
        })
      }}
      ></div>))}
    </div>
  </>
  )
}
