$(document).ready(function() {
  $("#play").on("click", () => {
    playGame();
  });
});

function playGame() {
  $.ajax({
    url: "/playGame",
    method: "get",
    dataType: "json",
    contentType: "application/json",
    success: function(result) {
      if (result.success) {
        $("#scores").empty();
        $("#stats").empty();
        result.result.forEach((frame, i) => generateScoreFrame(frame, i));
        overview(result.result);
      } else {
        $("#scores").empty();
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function generateScoreFrame(frame, i) {
  const round = i + 1;
  let throw1 = "";
  let throw2 = "";
  let bonusthrow = false;
  if (round === 10 && !(frame.status === "open")) {
    if (frame.status === "strike") {
      throw1 = frame.rolls[0] === 10 ? "X" : frame.rolls[0];
      throw2 = frame.rolls[1] === 10 ? "X" : frame.rolls[1];
      bonusthrow = frame.rolls[2] === 10 ? "X" : frame.rolls[2];
    } else {
      throw1 = frame.rolls[0];
      throw2 = "/";
      bonusthrow = frame.rolls[2];
    }
  } else {
    if (frame.status === "strike") {
      throw2 = "X";
    } else if (frame.status === "spare") {
      throw1 = frame.rolls[0];
      throw2 = "/";
    } else {
      throw1 = frame.rolls[0];
      throw2 = frame.rolls[1];
    }
  }

  const score =
    bonusthrow !== false
      ? tenthFrame(round, throw1, throw2, frame.cumSum, bonusthrow)
      : normalFrame(round, throw1, throw2, frame.cumSum);

  $("#scores").append(score);
}

function normalFrame(round, throw1, throw2, cumSum) {
  const score = `<div class="frame">
  <div class="round">
    <span>Round ${round}</span>
  </div>
  <div class="throws">
    <div class="throw">

    </div>
    <div class="throw1">
      <span>${throw1}</span>
    </div>
    <div class="throw2">
      <span>${throw2}</span>
    </div>
  </div>
  <div class="score">
    <span>${cumSum}</span>
  </div>
  </div>`;

  return score;
}

function tenthFrame(round, throw1, throw2, cumSum, bonusthrow) {
  const score = `<div class="frame">
  <div class="round">
    <span>Round ${round}</span>
  </div>
  <div class="throws">
    <div class="throw">

    </div>
    <div class="throw1">
      <span>${throw1}</span>
    </div>
    <div class="throw2">
      <span>${throw2}</span>
    </div>
    <div class="throw3">
      <span>${bonusthrow}</span>
    </div>
  </div>
  <div class="score">
    <span>${cumSum}</span>
  </div>
  </div>`;

  return score;
}

function overview(result) {
  const totalScore = result[result.length - 1].cumSum;
  const strikes = countStatus(result, "strike");
  const spares = countStatus(result, "spare");
  const overview = `<div class="totalScore"><p class="mb-0">Total score: ${totalScore}</p></div>
  <div class="strikes"><p class="mb-0">Strikes: ${strikes}</p></div>
  <div class="spares"><p class="mb-0">Spares: ${spares}</p></div><hr>`;

  $("#stats").append(overview);
}

function countStatus(arr, status) {
  return arr
    .map(frame => {
      return frame.status === status;
    })
    .reduce((acc, el) => {
      return acc + el;
    }, 0);
}
