const checkerState = {
  movesMade: 0,
  activePlayer: "red",
  redCheckersCount: 0,
  blackCheckersCount: 0,
};

export const checkIfPlayerWon = () => {
  console.log(checkerState);
  if (checkerState.redCheckersCount === 0) {
    alert("Player black won!");
  }

  if (checkerState.blackCheckersCount === 0) {
    alert("Player red won!");
  }
};

export default checkerState;
