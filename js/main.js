
//Animation
const speed = 100; //in millisecond(ms)

//Sprites
const totalSpriteHeight = 605;
const spriteHeight = 121;

//Html elements
const reels = document.getElementsByClassName('reels');

//Helpers
function randomInteger(min, max) {
  // from min to (max+1)
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function checkHorFrameLine(frame, matrix){
  for(let i = 0; i < matrix.length; i++){
    for(let j = 1; j < matrix[i].length; j++){
      if(matrix[i][j-1] === matrix[i][j] && matrix[i][j] === frame){
        if( j === (matrix[i].length - 1) ) return i;
      } else {
        break;
      }
    }
  }

  return null;
}

function getWinScore(matrix) {
  let totalScore = 0;

  let checkCherryLine = checkHorFrameLine('cherry', matrix);
  console.log('Check cherry in line: ', checkCherryLine);
  if( checkCherryLine === 0 ) totalScore += 2000;
  if( checkCherryLine === 1 ) totalScore += 1000;
  if( checkCherryLine === 2 ) totalScore += 4000;

  let checkSeven = checkHorFrameLine('seven', matrix);
  console.log('Check seven in line: ', checkSeven);
  if( checkSeven !== null ) totalScore += 150;

  let bar3 = checkHorFrameLine('bar-3', matrix);
  console.log('Check bar3 in line: ', bar3);
  if( bar3 !== null ) totalScore += 50;

  let bar2 = checkHorFrameLine('bar-2', matrix);
  console.log('Check bar2 in line: ', bar2);
  if( bar2 !== null ) totalScore += 20;

  let bar1 = checkHorFrameLine('bar-1', matrix);
  console.log('Check bar1 in line: ', bar1);
  if( bar1 !== null ) totalScore += 10;

  for(let i = 0; i < matrix.length; i++){
    for(let j = 1; j < matrix[i].length; j++){
      if((matrix[i][j-1] === 'cherry' || matrix[i][j-1] === 'seven') && (matrix[i][j] === 'cherry' || matrix[i][j] === 'seven')){
        if( j === (matrix[i].length - 1) ){
          console.log('cherry & seven = true');
          totalScore += 75;
        }
      } else {
        break;
      }
    }
  }

  for(let i = 0; i < matrix.length; i++){
    console.log(`Vec ${i+1}: ${matrix[i]}`);
    for(let j = 1; j < matrix[i].length; j++){
      if((matrix[i][j-1] === 'bar-3' || matrix[i][j-1] === 'bar-2' || matrix[i][j-1] === 'bar-1') && (matrix[i][j] === 'bar-3' || matrix[i][j] === 'bar-2' || matrix[i][j] === 'bar-1')){
        if( j === (matrix[i].length - 1) ){
          console.log('bars = true');
          totalScore += 5;
        }
      } else {
        break;
      }
    }
  }

  // let cs = checkHorFrameLine(['seven', 'cherry'], matrix);
  // console.log('Check cherry & seven in line: ', cs);
  // if( cs !== null ) totalScore += 75;
  //
  // let bars = checkHorFrameLine(['bar-1', 'bar-2', 'bar-3'], matrix);
  // console.log('Check bars in line: ', bars);
  // if( bars !== null ) totalScore += 5;


  return totalScore;
}

function stopAnimation(intervalVar){
  if(!intervalVar) return;
  clearInterval(intervalVar);
}

function startAnimation(reel) {
  let position = spriteHeight; //start position for the image
  const diff = spriteHeight; //difference between two sprites

  let interval = setInterval(() => {
    reel.style.backgroundPosition = `0px -${position}px`;

    if (position < totalSpriteHeight) {
      position = position + diff;
      // console.log('Pos: ', position);
    } else {
      position = spriteHeight;
    }
  }, speed);
  return interval;
}

function detectFrame(position){
  while(position > 5){ position -= 5; }
  switch(position){
    case 1:
      return 'seven'
      break;
    case 2:
      return 'bar-1'
      break;
    case 3:
      return 'bar-2'
      break;
    case 4:
      return 'cherry'
      break;
    case 5:
      return 'bar-3'
      break;
  }
}

//Main func
function main(){
  let intervals = [];
  let promiseList = [];
  for(let reel of reels){
    intervals.push( startAnimation(reel) );
  }

  for(let id = 0; id < intervals.length; id++){
    promiseList.push(
      new Promise((resolve) => {
        let timer = speed * randomInteger(6, 12);
        // console.log('Timer: ', timer);
        setTimeout(() => {
          let tmp = [];
          stopAnimation(intervals[id]);
          let position = Math.abs(parseInt(reels[id].style.backgroundPosition.split(' ')[1]));
          // console.log(
          //   `Reel-${id}
          //   Style: ${reels[id].style.backgroundPosition}
          //   Position: ${position}`
          // );
          // console.log(`Reel-${id+1}  Pos: `, detectFrame((position / spriteHeight) + 1));
          // console.log(`Reel-${id+1}  Pos: `, detectFrame((position / spriteHeight) + 2));
          // console.log(`Reel-${id+1}  Pos: `, detectFrame((position / spriteHeight) + 3));
          tmp.push(detectFrame((position / spriteHeight) + 1));
          tmp.push(detectFrame((position / spriteHeight) + 2));
          tmp.push(detectFrame((position / spriteHeight) + 3));
          resolve([...tmp]);
        }, timer);
      })
    );
  }

  Promise.all(promiseList).then((matrix) => {
    // let matrix = [
    //   ['bar-2', "bar-2", "bar-3"],
    //   ["bar-2", "bar-2", "bar-2"],
    //   ['cherry', "seven", "cherry"]
    // ];
    console.log('Matrix: ', matrix);
    console.log('Stats: ', getWinScore(matrix));
  });
}

main();
