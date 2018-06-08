/* X goes first
   computer is player 1
   player2 is player in single player mode */
let currentBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // value equals index
let wins = 0; // for player 1 or computer
let loss = 0; // wins for player 2
let ties = 0; // ties
let games = 0; // total games played
let noPlayers = "1"; // 1 or 2
let currentPlayer = "computer"; // computer, player1, or player2
let state = "stopped"; // stopped or started
let player1 = "X"; // player 1 or computer piece
let player2 = "O"; // player 2 chosen piece

// changes current player after each move
let changePlayer = player => {
  if (player === "computer") {
    currentPlayer = "player2";
    $("#message span").html("hooman's turn");
  } else if (player === "player1") {
    currentPlayer = "player2";
    $("#message span").html("player 2's turn");
  } else if (player === "player2" && noPlayers === 1) {
    currentPlayer = "computer";
    // used timeout to make it appear computer was thinking hard
    setTimeout(function() {
      playAI(currentBoard, player1, player2);
    }, 500);
    $("#message span").html("thinking...");
  } else if (player === "player2" && noPlayers === 2) {
    currentPlayer = "player1";
    $("#message span").html("player 1's turn");
  }
};

// board positions that haven't been played
let emptyIndexes = board => {
  return board.filter(value => value != "X" && value != "O");
};

// checks for win
let isWon = (board, piece) => {
  if (
    (board[0] == piece && board[1] == piece && board[2] == piece) ||
    (board[3] == piece && board[4] == piece && board[5] == piece) ||
    (board[6] == piece && board[7] == piece && board[8] == piece) ||
    (board[0] == piece && board[3] == piece && board[6] == piece) ||
    (board[1] == piece && board[4] == piece && board[7] == piece) ||
    (board[2] == piece && board[5] == piece && board[8] == piece) ||
    (board[0] == piece && board[4] == piece && board[8] == piece) ||
    (board[2] == piece && board[4] == piece && board[6] == piece)
  ) {
    return true;
  } else {
    return false;
  }
};

// check for draw
let isDraw = board => {
  return emptyIndexes(currentBoard).length === 0 ? true : false;
};

// checks for game terminal condition i.e. win or tie
let isTerminalCondition = (board, piece) => {
  if (isWon(board, piece) === true) {
    $(".modal-title").html(piece + " WINS");
    $("#game-status").modal("show", "focus");
    // alert (piece + ' WINS');
    if (piece === "X") {
      wins += 1;
      games += 1;
      $("#wins").html(wins);
      $("#games").html(games);
      state = "stopped";
    } else if (piece === "O") {
      loss += 1;
      games += 1;
      $("#loss").html(loss);
      $("#games").html(games);
      state = "stopped";
    }
  } else if (isDraw(board) === true) {
    $(".modal-title").html("It's a TIE");
    $("#game-status").modal("show", "focus");
    ties += 1;
    games += 1;
    $("#ties").html(ties);
    $("#games").html(games);
    state = "stopped";
  }
};

// checks for move to win or block oppponent from winning
let winOrBlock = (board, piece) => {
  for (let i = 0; i < emptyIndexes(board).length; i++) {
    let newBoard = board.slice(0);
    let index = emptyIndexes(board)[i];
    newBoard[index] = piece;
    if (isWon(newBoard, piece) === true) {
      return index;
    } else {
      continue;
    }
  }
};

// checks for fork
let isForked = (board, piece) => {
  if (
    (board[0] == piece && board[1] == piece && board[3] == piece) ||
    (board[0] == piece && board[1] == piece && board[4] == piece) ||
    (board[0] == piece && board[2] == piece && board[4] == piece) ||
    (board[0] == piece && board[2] == piece && board[6] == piece) ||
    (board[0] == piece && board[2] == piece && board[8] == piece) ||
    (board[0] == piece && board[3] == piece && board[4] == piece) ||
    (board[0] == piece && board[4] == piece && board[6] == piece) ||
    (board[0] == piece && board[6] == piece && board[8] == piece) ||
    (board[1] == piece && board[2] == piece && board[4] == piece) ||
    (board[1] == piece && board[2] == piece && board[5] == piece) ||
    (board[1] == piece && board[3] == piece && board[4] == piece) ||
    (board[1] == piece && board[4] == piece && board[5] == piece) ||
    (board[2] == piece && board[4] == piece && board[5] == piece) ||
    (board[2] == piece && board[4] == piece && board[8] == piece) ||
    (board[2] == piece && board[6] == piece && board[8] == piece) ||
    (board[3] == piece && board[4] == piece && board[6] == piece) ||
    (board[3] == piece && board[4] == piece && board[7] == piece) ||
    (board[3] == piece && board[6] == piece && board[7] == piece) ||
    (board[4] == piece && board[5] == piece && board[7] == piece) ||
    (board[4] == piece && board[5] == piece && board[8] == piece) ||
    (board[4] == piece && board[6] == piece && board[7] == piece) ||
    (board[4] == piece && board[6] == piece && board[8] == piece) ||
    (board[4] == piece && board[7] == piece && board[8] == piece) ||
    (board[5] == piece && board[7] == piece && board[8] == piece)
  ) {
    return true;
  } else {
    return false;
  }
};

// checks for move to fork or block opponent from forking
let forkOrBlock = (board, piece) => {
  for (let i = 0; i < emptyIndexes(board).length; i++) {
    let newBoard = board.slice(0);
    let index = emptyIndexes(board)[i];
    newBoard[index] = piece;
    if (isForked(newBoard, piece) === true) {
      return index;
    } else {
      continue;
    }
  }
};

// checks for move to play opposite corner if opponent played corner
let oppositeCorner = (board, opponent) => {
  if (board[0] == opponent && board[8] === 8) {
    return 8;
  } else if (board[2] == opponent && board[6] === 6) {
    return 6;
  } else if (board[6] == opponent && board[2] === 2) {
    return 2;
  } else if (board[8] == opponent && board[0] === 0) {
    return 0;
  }
};

// checks for move to play a corner
let playCorner = board => {
  if (board[0] === 0) {
    return 0;
  } else if (board[2] === 2) {
    return 2;
  } else if (board[6] === 6) {
    return 6;
  } else if (board[8] === 8) {
    return 8;
  }
};

// checks for move to play a side
let playSide = board => {
  if (board[1] === 1) {
    return 1;
  } else if (board[3] === 3) {
    return 3;
  } else if (board[5] === 5) {
    return 7;
  } else if (board[7] === 7) {
    return 7;
  }
};

// place piece on board
let playPiece = elem => {
  if (
    currentPlayer !== "player2" &&
    state === "started" &&
    currentBoard[elem] == elem
  ) {
    $("#" + elem + " a").html(player1);
    currentBoard[elem] = player1;
    isTerminalCondition(currentBoard, player1);
    changePlayer(currentPlayer);
  } else if (
    currentPlayer === "player2" &&
    state === "started" &&
    currentBoard[elem] == elem
  ) {
    $("#" + elem + " a").html(player2);
    currentBoard[elem] = player2;
    isTerminalCondition(currentBoard, player2);
    changePlayer(currentPlayer);
  }
};

// AI logic...guarantees a win or tie every time
let playAI = (board, player, opponent) => {
  let index = "";
  // win if possible
  if (winOrBlock(board, player) !== undefined) {
    index = winOrBlock(board, player);
    playPiece(index);
    // or block opponent from winning
  } else if (winOrBlock(board, opponent) !== undefined) {
    index = winOrBlock(board, opponent);
    playPiece(index);
    // or play fork
  } else if (forkOrBlock(board, player) !== undefined) {
    index = forkOrBlock(board, player);
    playPiece(index);
    // or block opponents fork
  } else if (forkOrBlock(board, opponent) !== undefined) {
    index = forkOrBlock(board, opponent);
    playPiece(index);
    // else play center
  } else if (board[4] == "4") {
    playPiece(4);
    // or play opposite corner
  } else if (oppositeCorner(board, opponent) !== undefined) {
    index = oppositeCorner(board, opponent);
    playPiece(index);
    // or play corner
  } else if (playCorner(board) !== undefined) {
    index = playCorner(board);
    playPiece(index);
    // or play side last
  } else if (playSide(board) !== undefined) {
    index = playSide(board);
    playPiece(index);
  }
};

// starts the game
let startGame = player => {
  if (player === "computer") {
    $("#message span").html("thinking....");
    // used timeout to make it appear computer was thinking hard
    setTimeout(function() {
      playAI(currentBoard, player1, player2);
    }, 500);
  } else if (player === "player1") {
    $("#message span").html("player 1's turn");
  } else if (player === "player2" && noPlayers === 1) {
    $("#message span").html("hooman's turn");
  } else if (player === "player2" && noPlayers === 2) {
    $("#message span").html("player 2's turn");
  }
};

$(document).ready(function() {
  // changes game to one player
  $("#1players").on("click", function() {
    noPlayers = 1;
    currentPlayer = "computer";
    player1 = "X";
    player2 = "O";
    $("#X")
      .parent()
      .removeClass("disabled");
    $("#message span").html("choose players piece");
  });
  // changes game to two players
  $("#2players").on("click", function() {
    noPlayers = 2;
    currentPlayer = "player1";
    player1 = "X";
    player2 = "O";
    $("#X")
      .parent()
      .addClass("disabled");
    $("#X").removeClass("active");
    $("#O").removeClass("active");
    $("#message span").html("press start - X goes first");
  });
  // if game is in one player mode, player chooses X piece
  $("#X").on("click", function() {
    if (noPlayers === 1) {
      player1 = "O";
      player2 = "X";
      currentPlayer = "player2";
      $("#message span").html("press start");
    }
  });
  // if game is in two player mode, player chooses O piece
  $("#O").on("click", function() {
    if (noPlayers === 1) {
      player1 = "X";
      player2 = "O";
      currentPlayer = "computer";
      $("#message span").html("press start");
    }
  });
  // start game
  $("#start").on("click", function() {
    state = "started";
    startGame(currentPlayer);
    $("#X")
      .parent()
      .addClass("disabled");
    $("#1players")
      .parent()
      .addClass("disabled");
  });
  // reset game to defaults
  $("#reset").on("click", function() {
    currentBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    wins = 0;
    loss = 0;
    ties = 0;
    games = 0;
    noPlayers = 1;
    currentPlayer = "computer";
    state = "stopped";
    player1 = "X";
    player2 = "O";
    $("#wins").html(wins);
    $("#loss").html(loss);
    $("#ties").html(ties);
    $("#games").html(games);
    $("#message span").html("choose no. of players");
    $("#1players").removeClass("active");
    $("#2players").removeClass("active");
    $("#X").removeClass("active");
    $("#O").removeClass("active");
    $("#X")
      .parent()
      .addClass("disabled");
    $("#1players")
      .parent()
      .removeClass("disabled");
    $("a").html("");
  });
  // continue playing a new game with current settings after game is over
  $("#play-again").on("click", function() {
    currentBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    state = "started";
    $("a").html("");
    $("#game-status").modal("hide");
    startGame(currentPlayer);
  });

  // tic tac toe board
  $("#0").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#1").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#2").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#3").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#4").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#5").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#6").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#7").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
  $("#8").on("click", function() {
    let elem = $(this).attr("id");
    if (currentPlayer !== "computer") {
      playPiece(elem);
    }
  });
});
