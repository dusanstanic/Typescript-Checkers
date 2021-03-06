import { MoveOneSpaceCommand, MoveTwoSpaceCommand } from "../view/checkerView";
import checkerState, { checkIfPlayerWon, finishTurn } from "../checkerState";
import choiceElements from "../base/choiceBase";

interface MoveChecker {
  coordinateFrom: number;
  coordinateTo: number;
  fieldElTo: HTMLDivElement;
  checkerElFrom: HTMLDivElement;
  sideFrom: string;
}

interface Move {
  moveDistance: number;
  moveChecker: MoveChecker;
}

enum Direction {
  BottomRight,
  BottomLeft,
  TopRight,
  TopLeft,
}

enum OneSpaceDistance {
  BottomRight = 11,
  BottomLeft = 9,
  TopRight = -9,
  TopLeft = -11,
}

enum TwoSpaceDistance {
  BottomRight = 22,
  BottomLeft = 18,
  TopRight = -18,
  TopLeft = -22,
}

const controller = () => {
  const checkers = document.querySelectorAll(".checker")!;
  const fields = document.querySelectorAll(".checker__field")!;

  const checkersArr = <Element[]>Array.prototype.slice.call(checkers);

  checkersArr.forEach((checker) => {
    checker.addEventListener("dragstart", (e: any) => {
      const coordinate: string = e.target.closest(".checker__field").dataset
        .coordinate;
      const event = <DragEvent>e;

      if (event.dataTransfer) {
        event.dataTransfer.setData("text/plain", coordinate);
        event.dataTransfer.effectAllowed = "move";
      }
    });
  });

  const fieldsArr = <Element[]>Array.prototype.slice.call(fields);

  fieldsArr.forEach((field) => {
    field.addEventListener("dragover", (e: any) => {
      if (e.dataTransfer.types[0] === "text/plain") {
        e.preventDefault();
      }
    });

    field.addEventListener("drop", (e: any) => {
      const event = <DragEvent>e;
      const target = <HTMLDivElement>event.target;

      isMoveAllowed(event, target);
    });
  });

  choiceElements.finishTurnBtn.addEventListener("click", () => {
    if (checkerState.movesMade === 0) {
      alert("Must make at least one move");
      return;
    }

    finishTurn();
  });

  choiceElements.undoBtn.addEventListener("click", () => {
    if (checkerState.undo) {
      checkerState.undo();
      checkerState.undo = undefined;

      checkerState.movesMade--;
      checkerState.moveHistory = [];

      console.log(checkerState);
      return;
    }

    alert("No undo can be done");
  });
};

const isMoveAllowed = (event: DragEvent, toEl: HTMLDivElement) => {
  const fieldElTo = <HTMLDivElement>toEl.closest(".checker__field");
  const checkerElTo = <HTMLDivElement>fieldElTo.firstElementChild;

  const coordinateFrom = +event.dataTransfer!.getData("text/plain");
  const coordinateTo = +fieldElTo.dataset.coordinate!;
  const fieldToHasChecker =
    fieldElTo.dataset.isCheckerField! === "true" ? true : false;

  const fieldElFrom = <HTMLDivElement>(
    document.querySelector(`[data-coordinate='${coordinateFrom}']`)
  );
  const checkerElFrom = <HTMLDivElement>fieldElFrom.firstElementChild;

  const sideFrom = checkerElFrom.dataset.fieldSide ? "black" : "red";

  const activePlayer = checkerState.activePlayer;

  if (sideFrom !== activePlayer) {
    alert(`Cannot move only ${activePlayer} can move now`);
    return false;
  }

  if (checkerState.moveHistory[checkerState.moveHistory.length - 1] === "one") {
    alert("Cannot move anymore end turn");
    return false;
  }

  if (!fieldToHasChecker) {
    const moveCheckerObj: MoveChecker = {
      coordinateTo,
      coordinateFrom,
      fieldElTo,
      checkerElFrom,
      sideFrom,
    };

    if (moveChecker(moveCheckerObj)) {
      checkerState.movesMade++;

      if (sideFrom === "black" && coordinateTo >= 10 && coordinateTo <= 17) {
        checkerElFrom.classList.add("king");
      }

      if (sideFrom === "red" && coordinateTo >= 80 && coordinateTo <= 87) {
        checkerElFrom.classList.add("king");
      }

      checkIfPlayerWon();

      return true;
    }

    return false;
  }

  alert("Place already has checker");
  return false;
};

const moveChecker = (moveCheckerObj: MoveChecker) => {
  const { coordinateFrom, coordinateTo } = moveCheckerObj;

  const moveDistance = coordinateTo - coordinateFrom;

  const move: Move = {
    moveChecker: moveCheckerObj,
    moveDistance: moveDistance,
  };

  const isMoveDistanceValid = isMoveValid(coordinateFrom, coordinateTo);
  console.log(isMoveDistanceValid);

  if (!isMoveDistanceValid[0]) {
    alert("Not moving by rules !");
    return false;
  }

  if (isMoveDistanceValid[1] === "one") {
    return moveSpace(move);
  }

  if (isMoveDistanceValid[1] === "two") {
    return moveTwoSpacesChecker(move);
  }
};

const moveSpace = (move: Move) => {
  const {
    moveChecker: { checkerElFrom, coordinateFrom, fieldElTo },
  } = move;

  if (checkerState.movesMade > 0) {
    alert(
      "Cannot move by one space anymore check and see if skips are possible end turn if not"
    );
    return false;
  }

  checkerState.moveHistory.push("one");

  const moveSpaceCommand = new MoveOneSpaceCommand(
    coordinateFrom,
    fieldElTo,
    checkerElFrom
  );

  moveSpaceCommand.execute();
  checkerState.undo = moveSpaceCommand.undo;

  return true;
};

const moveTwoSpacesChecker = (move: Move) => {
  const {
    moveDistance,
    moveChecker: { checkerElFrom, coordinateFrom, fieldElTo, sideFrom },
  } = move;

  checkerState.moveHistory.push("two");

  const direction = getDirection(moveDistance, sideFrom, checkerElFrom);
  let coordinateSkipped = 0;
  const { BottomLeft, BottomRight, TopLeft, TopRight } = OneSpaceDistance;

  if (direction === Direction.BottomRight) {
    coordinateSkipped = coordinateFrom + 11;
  }

  if (direction === Direction.BottomLeft) {
    coordinateSkipped = coordinateFrom + 9;
  }

  if (direction === Direction.TopLeft) {
    coordinateSkipped = coordinateFrom - 11;
  }

  if (direction === Direction.TopRight) {
    coordinateSkipped = coordinateFrom - 9;
  }

  const isMoveValid = isMoveTwoSpaceValid(coordinateSkipped, sideFrom);
  if (!isMoveValid) {
    return false;
  }

  if (sideFrom === "red") {
    checkerState.blackCheckersCount--;
  } else {
    checkerState.redCheckersCount--;
  }

  return moveTwoSpaces({
    checkerElFrom,
    coordinateFrom,
    fieldElTo,
    coordinateSkipped,
  });
};

type MoveTwoSpaces = {
  checkerElFrom: HTMLDivElement;
  fieldElTo: HTMLDivElement;
  coordinateFrom: number;
  coordinateSkipped: number;
};

const getDirection = (
  moveDistance: number,
  sideFrom: string,
  checkerElFrom: HTMLDivElement
) => {
  const { TopRight, TopLeft, BottomRight, BottomLeft } = TwoSpaceDistance;

  const isKing = checkerElFrom.classList.contains("king");

  if (
    (moveDistance === BottomRight && sideFrom === "red") ||
    (moveDistance === BottomRight && isKing)
  ) {
    return Direction.BottomRight;
  }

  if (
    (moveDistance === BottomLeft && sideFrom === "red") ||
    (moveDistance === BottomLeft && isKing)
  ) {
    return Direction.BottomLeft;
  }

  if (
    (moveDistance === TopLeft && sideFrom === "black") ||
    (moveDistance === TopLeft && isKing)
  ) {
    return Direction.TopLeft;
  }

  if (
    (moveDistance === TopRight && sideFrom === "black") ||
    (moveDistance === TopRight && isKing)
  ) {
    return Direction.TopRight;
  }
};

const moveTwoSpaces = ({
  checkerElFrom,
  fieldElTo,
  coordinateFrom,
  coordinateSkipped,
}: MoveTwoSpaces) => {
  const moveTwoSpaceCommand = new MoveTwoSpaceCommand({
    coordinateFrom,
    coordinateSkipped,
    fieldElTo,
    checkerElFrom,
  });

  moveTwoSpaceCommand.execute();
  checkerState.undo = moveTwoSpaceCommand.undo;

  return true;
};

const isMoveTwoSpaceValid = (coordinateSkipped: number, sideFrom: string) => {
  const fieldSkippedEl = <HTMLDivElement>(
    document.querySelector(`[data-coordinate='${coordinateSkipped}']`)
  );
  const checkerSkippedEl = <HTMLDivElement>fieldSkippedEl.firstElementChild;

  if (!checkerSkippedEl) {
    alert("Not moving by rules");
    return false;
  }

  const sideSkipped = checkerSkippedEl.dataset.fieldSide ? "black" : "red";

  if (sideFrom === sideSkipped) {
    alert("Cannot skip element of same color");
    return false;
  }

  return true;
};

const isMoveValid = (
  coordinateFrom: number,
  coordinateTo: number
): [boolean, string] => {
  const { BottomLeft, BottomRight, TopLeft, TopRight } = OneSpaceDistance;
  const {
    TopRight: TopRightTwo,
    TopLeft: TopLeftTwo,
    BottomRight: BottomRightTwo,
    BottomLeft: BottomLeftTwo,
  } = TwoSpaceDistance;

  const moveOneSpaceOptions = [BottomLeft, BottomRight, TopLeft, TopRight];
  const moveTwoSpaceOptions = [
    TopRightTwo,
    TopLeftTwo,
    BottomRightTwo,
    BottomLeftTwo,
  ];
  const moveDistance = coordinateFrom - coordinateTo;

  const isMoveSpaceValid = isDistanceValid(moveDistance, moveOneSpaceOptions);
  if (isMoveSpaceValid) {
    return [true, "one"];
  }

  const isMoveTwoSpaceValid = isDistanceValid(
    moveDistance,
    moveTwoSpaceOptions
  );
  if (isMoveTwoSpaceValid) {
    return [true, "two"];
  }

  return [false, ""];
};

const isDistanceValid = (
  moveDistance: number,
  moveDistanceOptions: number[]
) => {
  return moveDistanceOptions.some((distance) => {
    return distance === moveDistance;
  });
};

export default controller;
