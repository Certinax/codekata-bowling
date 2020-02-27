const express = require("express");
const router = express.Router();
const startGame = require("../game/bowling");

router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Bowling"
  });
});

router.get("/playgame", function(req, res) {
  // console.log("Playgame is hit");
  const game = startGame();
  let result = [];
  let success = false;
  if (game.length === 10) {
    success = true;
    result = game;
  }
  res.json({
    success: success,
    result: result
  });
});

module.exports = router;
