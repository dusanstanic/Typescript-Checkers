interface CheckerState {
  undo?: Function;
  moveHistory: string[];
  movesMade: number;
  activePlayer: string;
  redCheckersCount: number;
  blackCheckersCount: number;
}

const checkerInitialState: CheckerState = {
  undo: undefined,
  moveHistory: [],
  movesMade: 0,
  activePlayer: "red",
  redCheckersCount: 12,
  blackCheckersCount: 12,
};

let checkerState: CheckerState = { ...checkerInitialState };

export const checkIfPlayerWon = () => {
  console.log(checkerState);
  if (checkerState.redCheckersCount === 0) {
    alert("Player black won!");
  }

  if (checkerState.blackCheckersCount === 0) {
    alert("Player red won!");
  }
};

export const finishTurn = () => {
  checkerState.activePlayer === "red"
    ? (checkerState.activePlayer = "black")
    : (checkerState.activePlayer = "red");

  checkerState.movesMade = 0;
  checkerState.moveHistory = [];

  updateCheckerUI();
};

export const resetCheckerState = () => {
  checkerState = cloneCheckerState(checkerInitialState);
};

export const updateCheckerUI = () => {
  const activeBtn = document.querySelector(".active");
  activeBtn?.classList.remove("active");

  const playerTurn = <HTMLDivElement>document.querySelector(".player__turn");
  playerTurn.textContent = `Current Player: ${checkerState.activePlayer.toUpperCase()}`;

  if (checkerState.activePlayer === "black") {
    playerTurn.classList.add("player__turn--black");
  } else {
    playerTurn.classList.remove("player__turn--black");
  }

  const checkerAmount = document.querySelectorAll(".player__amount");
  checkerAmount[0].textContent = "Total: " + checkerState.redCheckersCount;
  checkerAmount[1].textContent = "Total: " + checkerState.blackCheckersCount;
};

const cloneCheckerState = (inObject: any) => {
  let outObject: any;
  let value;
  let key;

  if (typeof inObject !== "object" || null) {
    return inObject;
  }

  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    outObject[key] = cloneCheckerState(value);
  }

  return outObject;
};

export default checkerState;
