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

// rotate matrix: reels to rows transform
function getLines(matrix) {
  let result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let row = matrix.map(e => e[i]).reverse();
    result.push(row);
  }
  return result;
};


// count wins
function getWinScore(rmatrix) {
  let totalScore = 0;

  for (let i = 0; i < rmatrix.length; i++) {
    if (i === 0) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 2000 : totalScore += 0;

      const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
      cherry7 ? totalScore += 75 : totalScore += 0;

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
      }

    } else if (i === 1) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 1000 : totalScore += 0;

      const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
      cherry7 ? totalScore += 75 : totalScore += 0;

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
      }

    } else if (i === 2) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 4000 : totalScore += 0;

      const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
      cherry7 ? totalScore += 75 : totalScore += 0;

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
      }

    }
  }

  return totalScore;
}

function stopAnimation(intervalVar) {
  if (!intervalVar) return;
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

function detectFrame(position) {
  while (position > 5) {
    position -= 5;
  }
  switch (position) {
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
function main() {
  let intervals = [];
  let promiseList = [];
  for (let reel of reels) {
    intervals.push(startAnimation(reel));
  }

  for (let id = 0; id < intervals.length; id++) {
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

    let rmatrix = getLines(matrix);
    console.log('RM: ', rmatrix);
    console.log('Stats: ', getWinScore(rmatrix));
  });
}
