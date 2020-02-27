const STRIKE = "strike";
const SPARE = "spare";
const OPEN = "open";

function startGame() {
  const gameToken = initializeGame(playGame);
  // console.log("gameToken: ", gameToken);
  return gameToken;
}

function initializeGame(newGame) {
  console.log("Initializing game...");
  const game = [];
  return newGame(game);
}

function playGame(game) {
  const frames = 10;
  for (let round = 0; round < frames; round++) {
    game[round] = bowl(round);
  }
  calculateScore(game);
  cumulativeSum(game);
  return game;
}

function bowl(round) {
  let throws = 2;
  let pins = 10;

  let frame = {
    rolls: [],
    status: ""
  };

  while (throws > 0) {
    let rollScore = Math.round(Math.random() * pins);
    if (throws === 2 && rollScore === 10) {
      frame.rolls.push(rollScore);
      break;
    } else {
      frame.rolls.push(rollScore);
    }
    pins -= rollScore;
    throws--;
  }

  frame.status = getStatus(frame.rolls);

  if (round === 9 && frame.status !== OPEN) {
    frame = bonusRoll(frame);
  }

  return frame;
}

function bonusRoll(frame) {
  let throws;
  let pins = 10;
  if (frame.status === STRIKE) {
    throws = 2;
  } else {
    throws = 1;
  }

  while (throws > 0) {
    let rollScore = Math.round(Math.random() * pins);
    if (throws === 2 && rollScore === 10) {
      frame.rolls.push(rollScore);
    } else {
      frame.rolls.push(rollScore);
      pins -= rollScore;
    }
    throws--;
  }

  return frame;
}

function getStatus(rolls) {
  if (rolls[0] === 10) {
    return STRIKE;
  } else if (rolls[0] + rolls[1] === 10) {
    return SPARE;
  } else {
    return OPEN;
  }
}

function calculateScore(game) {
  game.forEach((frame, idx) => {
    if (frame.status === OPEN) {
      frame.score = frame.rolls.reduce((acc, el) => acc + el);
    } else if (frame.status === STRIKE) {
      let thisScore = frame.rolls[0];
      let nextScore = 0;
      if (idx === game.length - 1) {
        thisScore = frame.rolls.reduce((acc, el) => acc + el);
      } else {
        if (game[idx + 1].status === OPEN) {
          // Case where next frame has status open
          nextScore = game[idx + 1].rolls.reduce((acc, el) => acc + el);
        } else if (idx < game.length - 2 && game[idx + 1].status === STRIKE) {
          // Case where next frame is a strike
          const nextFrameScore = game[idx + 1].rolls[0];
          const nNextFrameScore = game[idx + 2].rolls[0];
          nextScore = nextFrameScore + nNextFrameScore;
        } else {
          // Case where next frame is a spare
          nextScore = game[idx + 1].rolls[0] + game[idx + 1].rolls[1];
        }
      }
      frame.score = thisScore + nextScore;
    } else if (frame.status === SPARE) {
      let thisScore = frame.rolls.reduce((acc, el) => acc + el);
      let nextScore = 0;
      if (idx < game.length - 1) {
        nextScore = game[idx + 1].rolls[0];
      }
      frame.score = thisScore + nextScore;
    }
  });
}

function cumulativeSum(game) {
  return game
    .map(frame => {
      return frame.score;
    })
    .reduce((acc, el, idx) => {
      const cumsum = acc + el;
      game[idx].cumSum = cumsum;
      return cumsum;
    }, 0);
  // console.log("Sum: ", totalScore);
}

module.exports = startGame;
