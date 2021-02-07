//Debug mode
var isDebug = false;
let dOpt = [];
let setIntervals = []; // tracking blinking

//test
dOpt = [
  {frame: 'seven', position: 'bot', reelId: 0},
  {frame: 'seven', position: 'bot', reelId: 1},
  {frame: 'seven', position: 'bot', reelId: 2}
];

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

// win blinking
function blink(el) {
  var curEl = document.getElementById(el);
  const curID = setInterval(function () {
    curEl.style.color = (curEl.style.color == 'red' ? 'black' : 'red');
  }, 444);
  setIntervals.push(curID);
}

// reset blinking
function resetBlink() {
  for (let iID of setIntervals ) {
    clearInterval(iID);
  }
  const elSet = [
    'win-cherry-top',
    'win-cherry-mid',
    'win-cherry-bot',
    'win-bar-1',
    'win-bar-2',
    'win-bar-3',
    'win-bars',
    'win-cherry-7',
    'win-7'
  ];
  for (let el of elSet) {
    let curEl = document.getElementById(el);
    curEl.style.color = 'black';
  }
}

function getFramePositionInPixels(opt) {
  let coef = 0;
  switch (opt.frame) {
    case 'seven':
      coef = 0;
      break;
    case 'bar-1':
      coef = 1;
      break;
    case 'bar-2':
      coef = 2;
      break;
    case 'cherry':
      coef = 3;
      break;
    case 'bar-3':
      coef = 4;
      break;
  }

  switch (opt.position) {
    case 'top':
      coef -= 0;
      break;
    case 'mid':
      coef -= 1;
      break;
    case 'bot':
      coef -= 2;
      break;
  }

  let pix = spriteHeight * coef;
  while (pix < 0) {
    pix += totalSpriteHeight;
  }
  return pix;
}

function switchDebugMode() {
  isDebug = !isDebug;

  if (dOpt.length !== reels.length) {
    setDefaultDebugMode();
  }
}

function setDefaultDebugMode() {

  let id = 0;
  for (let r of reels) {
    dOpt.push({frame: 'seven', position: 'top', reelId: id});
    id++;
  }
}

function setupDebugMode() {
  resetBlink();
  if (!isDebug) return;
  let matrix = Array(reels.length);
  for (let id = 0; id < reels.length; id++) {
    let tmp = [];
    let position = getFramePositionInPixels(dOpt.find((el) => el.reelId === id));
    console.log(`Reel id: ${id}, position: ${position}`)
    reels[id].style.backgroundPosition = `0px -${position}px`;

    let currPosition = Math.abs(parseInt(reels[id].style.backgroundPosition.split(' ')[1]));
    tmp.push(detectFrame((currPosition / spriteHeight) + 1));
    tmp.push(detectFrame((currPosition / spriteHeight) + 2));
    tmp.push(detectFrame((currPosition / spriteHeight) + 3));
    matrix[id] = [...tmp];
  }

  let rmatrix = getLines(matrix);
  console.log('debug RM: ', rmatrix);
  console.log('debug Stats: ', getWinScore(rmatrix));
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

      const seven = rmatrix[i].every(el => el.match('seven'));
      seven ? totalScore += 150 : totalScore += 0;

      if (!seven && !cherry) {
        const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
        cherry7 ? totalScore += 75 : totalScore += 0;
        cherry ? blink('win-cherry-7') : null;
      }

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
        bar ? blink('win-bars') : null;
      }

      cherry ? blink('win-cherry-top') : null;
      seven ? blink('win-7') : null;
      bar3 ? blink('win-bar-3') : null;
      bar2 ? blink('win-bar-2') : null;
      bar1 ? blink('win-bar-1') : null;

    } else if (i === 1) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 1000 : totalScore += 0;

      const seven = rmatrix[i].every(el => el.match('seven'));
      seven ? totalScore += 150 : totalScore += 0;

      if (!seven && !cherry) {
        const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
        cherry7 ? totalScore += 75 : totalScore += 0;
        cherry ? blink('win-cherry-7') : null;
      }

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
        bar ? blink('win-bars') : null;
      }

      cherry ? blink('win-cherry-mid') : null;
      seven ? blink('win-7') : null;
      bar3 ? blink('win-bar-3') : null;
      bar2 ? blink('win-bar-2') : null;
      bar1 ? blink('win-bar-1') : null;

    } else if (i === 2) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 4000 : totalScore += 0;

      const seven = rmatrix[i].every(el => el.match('seven'));
      seven ? totalScore += 150 : totalScore += 0;

      if (!seven && !cherry) {
        const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
        cherry7 ? totalScore += 75 : totalScore += 0;
        cherry ? blink('win-cherry-7') : null;
      }

      const bar3 = rmatrix[i].every(el => el.match('bar-3'));
      bar3 ? totalScore += 50 : totalScore += 0;
      const bar2 = rmatrix[i].every(el => el.match('bar-2'));
      bar2 ? totalScore += 20 : totalScore += 0;
      const bar1 = rmatrix[i].every(el => el.match('bar-1'));
      bar1 ? totalScore += 10 : totalScore += 0;

      if (!bar3 && !bar2 && !bar1) {
        const bar = rmatrix[i].every(el => el.match('bar'));
        bar ? totalScore += 5 : totalScore += 0;
        bar ? blink('win-bars') : null;
      }

      cherry ? blink('win-cherry-bot') : null;
      seven ? blink('win-7') : null;
      bar3 ? blink('win-bar-3') : null;
      bar2 ? blink('win-bar-2') : null;
      bar1 ? blink('win-bar-1') : null;

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
  resetBlink();
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
