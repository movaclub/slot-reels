// glob presets
document.getElementById('btn-debug').disabled = true;
document.getElementById('btn-spin').disabled = false;

//Debug mode
var isDebug = false;
let dOpt = [];
let setIntervals = []; // tracking blinking

function reel1pos() {
  dOpt[0]['position'] = document.getElementById('reel1pos').value;
}

function reel1frame() {
  dOpt[0]['frame'] = document.getElementById('reel1frame').value;
}

function reel2pos() {
  dOpt[1]['position'] = document.getElementById('reel2pos').value;
}

function reel2frame() {
  dOpt[1]['frame'] = document.getElementById('reel2frame').value;
}

function reel3pos() {
  dOpt[2]['position'] = document.getElementById('reel3pos').value;
}

function reel3frame() {
  dOpt[2]['frame'] = document.getElementById('reel3frame').value;
}

function doDebugSetup() {
  reel1pos();
  reel1frame();
  reel2pos();
  reel2frame();
  reel3pos();
  reel3frame();
}


//test
dOpt = [
  {frame: 'bar-3', position: 'bot', reelId: 0},
  {frame: 'bar-1', position: 'bot', reelId: 1},
  {frame: 'bar-3', position: 'bot', reelId: 2}
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
    curEl.style.color = (curEl.style.color === 'red' ? 'black' : 'red');
  }, 444);
  setIntervals.push(curID);
}

// reset blinking
function resetBlink() {
  for (let iID of setIntervals) {
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

  if (isDebug) {
    document.getElementById('btn-debug').disabled = false;
    document.getElementById('btn-spin').disabled = true;
  } else {
    document.getElementById('btn-debug').disabled = true;
    document.getElementById('btn-spin').disabled = false;
  }

}

function setupDebugMode() {
  resetBlink();
  console.log('DOPT1: ', dOpt);
  if (!isDebug) return;
  doDebugSetup();
  console.log('DOPT2: ', dOpt);
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
  let payTableArray = [0, 0, 0, 0, 0, 0];
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
        cherry7 ? payTableArray[4] = true : payTableArray[4] = payTableArray[4];
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
        bar ? payTableArray[0] = true : payTableArray[0] = payTableArray[0];
      }

      cherry ? blink('win-cherry-top') : null;
      seven ? payTableArray[5] = true : payTableArray[5] = payTableArray[5];
      bar3 ? payTableArray[3] = true : payTableArray[3] = payTableArray[3];
      bar2 ? payTableArray[2] = true : payTableArray[2] = payTableArray[2];
      bar1 ? payTableArray[1] = true : payTableArray[1] = payTableArray[1];

    } else if (i === 1) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 1000 : totalScore += 0;

      const seven = rmatrix[i].every(el => el.match('seven'));
      seven ? totalScore += 150 : totalScore += 0;

      if (!seven && !cherry) {
        const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
        cherry7 ? totalScore += 75 : totalScore += 0;
        cherry7 ? payTableArray[4] = true : payTableArray[4] = payTableArray[4];
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
        bar ? payTableArray[0] = true : payTableArray[0] = payTableArray[0];
      }

      cherry ? blink('win-cherry-mid') : null;
      seven ? payTableArray[5] = true : payTableArray[5] = payTableArray[5];
      bar3 ? payTableArray[3] = true : payTableArray[3] = payTableArray[3];
      bar2 ? payTableArray[2] = true : payTableArray[2] = payTableArray[2];
      bar1 ? payTableArray[1] = true : payTableArray[1] = payTableArray[1];

    } else if (i === 2) {
      console.log(i, ' - ', rmatrix[i]);
      const cherry = rmatrix[i].every(el => el.match('cherry'));
      cherry ? totalScore += 4000 : totalScore += 0;

      const seven = rmatrix[i].every(el => el.match('seven'));
      seven ? totalScore += 150 : totalScore += 0;

      if (!seven && !cherry) {
        const cherry7 = rmatrix[i].every(el => el.match(/(cherry|seven)/));
        cherry7 ? totalScore += 75 : totalScore += 0;
        cherry7 ? payTableArray[4] = true : payTableArray[4] = payTableArray[4];
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
        bar ? payTableArray[0] = true : payTableArray[0] = payTableArray[0];
      }

      cherry ? blink('win-cherry-bot') : null;
      seven ? payTableArray[5] = true : payTableArray[5] = payTableArray[5];
      bar3 ? payTableArray[3] = true : payTableArray[3] = payTableArray[3];
      bar2 ? payTableArray[2] = true : payTableArray[2] = payTableArray[2];
      bar1 ? payTableArray[1] = true : payTableArray[1] = payTableArray[1];

    }
  }

  payTableArray[4] ? blink('win-cherry-7') : null;
  payTableArray[3] ? blink('win-bar-3') : null;
  payTableArray[2] ? blink('win-bar-2') : null;
  payTableArray[1] ? blink('win-bar-1') : null;
  payTableArray[0] ? blink('win-bars') : null;
  payTableArray[5] ? blink('win-7') : null;

  document.getElementById('current-win').innerText = totalScore;
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
    // console.log('Matrix: ', matrix);
    let rmatrix = getLines(matrix);
    let total = getWinScore(rmatrix);
    // console.log('RM: ', rmatrix);
    console.log('Stats: ', total);
  });
}
