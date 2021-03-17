import {
  removeCheckerFromField,
  moveCheckerToField,
  skipElement,
} from "../view/checkerView";
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
  coordinateFrom: number;
  fieldElTo: HTMLDivElement;
  checkerElFrom: HTMLDivElement;
  sideFrom?: string;
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
};

const isMoveAllowed = (event: DragEvent, toEl: HTMLDivElement) => {
  const fieldElTo = <HTMLDivElement>toEl.closest(".checker__field");
  const checkerElTo = <HTMLDivElement>fieldElTo.firstElementChild;

  const coordinateFrom = +event.dataTransfer!.getData("text/plain");
  const coordinateTo = +fieldElTo.dataset.coordinate!;
  const fieldToHasChecker =
    fieldElTo.dataset.isCheckerField! === "true" ? true : false;

  console.log(fieldElTo.dataset);

  console.log(fieldToHasChecker);

  const fieldElFrom = <HTMLDivElement>(
    document.querySelector(`[data-coordinate='${coordinateFrom}']`)
  );
  const checkerElFrom = <HTMLDivElement>fieldElFrom.firstElementChild;
  const sideFrom = checkerElFrom.dataset.fieldside ? "black" : "red";

  const activePlayer = checkerState.activePlayer;

  if (sideFrom !== activePlayer) {
    alert(`Cannot move only ${activePlayer} can move now`);
    return false;
  }

  if (checkerState.moveHistory.pop() === "one") {
    alert("Cannot move anymore ending turn");
    return false;
  }

  if (!fieldToHasChecker) {
    if (
      moveChecker({
        coordinateTo,
        coordinateFrom,
        fieldElTo,
        checkerElFrom,
        sideFrom,
      })
    ) {
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

const moveChecker = ({
  coordinateFrom,
  coordinateTo,
  fieldElTo,
  checkerElFrom,
  sideFrom,
}: MoveChecker) => {
  const moveOneSpaceOptions = [-9, 9, 11, -11];
  const moveTwoSpaceOptions = [-18, 18, 22, -22];
  const moveDistance = coordinateFrom - coordinateTo;

  const isMoveSpaceValid = isMoveValid(moveDistance, moveOneSpaceOptions);

  if (isMoveSpaceValid) {
    return moveSpace({
      checkerElFrom,
      coordinateFrom,
      fieldElTo,
      moveDistance,
    });
  }

  const isMoveTwoSpaceValid = isMoveValid(moveDistance, moveTwoSpaceOptions);

  if (isMoveTwoSpaceValid) {
    return moveTwoSpaces({
      moveDistance,
      checkerElFrom,
      fieldElTo,
      coordinateFrom,
      sideFrom,
    });
  }

  alert("Not moving by rules");
  return false;
};

const moveSpace = ({
  moveDistance,
  checkerElFrom,
  fieldElTo,
  coordinateFrom,
}: Move) => {
  if (checkerState.movesMade > 0) {
    alert(
      "Cannot move by one space anymore check and see if skips are possible end turn if not"
    );
    return false;
  }

  checkerState.moveHistory.push("one");

  removeCheckerFromField(coordinateFrom);
  moveCheckerToField(fieldElTo, checkerElFrom);

  return true;
};

const moveTwoSpaces = ({
  moveDistance,
  checkerElFrom,
  fieldElTo,
  coordinateFrom,
  sideFrom,
}: Move) => {
  if (!sideFrom) return false;

  if (
    (moveDistance === -22 && sideFrom === "red") ||
    (moveDistance === -22 && checkerElFrom.classList.contains("king"))
  ) {
    const coordinateSkipped = coordinateFrom + 11;

    if (!checkIsSkipAllowed(coordinateSkipped, sideFrom)) {
      return false;
    }

    checkerState.blackCheckersCount--;
    skipElement({
      coordinateFrom,
      coordinateSkipped,
      fieldElTo,
      checkerElFrom,
    });

    return true;
  }

  if (
    (moveDistance === -18 && sideFrom === "red") ||
    (moveDistance === -18 && checkerElFrom.classList.contains("king"))
  ) {
    const coordinateSkipped = coordinateFrom + 9;

    if (!checkIsSkipAllowed(coordinateSkipped, sideFrom)) {
      return false;
    }

    checkerState.blackCheckersCount--;
    skipElement({
      coordinateFrom,
      coordinateSkipped,
      fieldElTo,
      checkerElFrom,
    });

    return true;
  }

  if (
    (moveDistance === 22 && sideFrom === "black") ||
    (moveDistance === 22 && checkerElFrom.classList.contains("king"))
  ) {
    const coordinateSkipped = coordinateFrom - 11;

    if (!checkIsSkipAllowed(coordinateSkipped, sideFrom)) {
      return false;
    }

    checkerState.redCheckersCount--;
    skipElement({
      coordinateFrom,
      coordinateSkipped,
      fieldElTo,
      checkerElFrom,
    });

    return true;
  }

  if (
    (moveDistance === 18 && sideFrom === "black") ||
    (moveDistance === 18 && checkerElFrom.classList.contains("king"))
  ) {
    const coordinateSkipped = coordinateFrom - 9;

    if (!checkIsSkipAllowed(coordinateSkipped, sideFrom)) {
      return false;
    }

    checkerState.redCheckersCount--;
    skipElement({
      coordinateFrom,
      coordinateSkipped,
      fieldElTo,
      checkerElFrom,
    });

    return true;
  }

  return false;
};

const checkIsSkipAllowed = (coordinateSkipped: number, sideFrom: string) => {
  const fieldSkippedEl = <HTMLDivElement>(
    document.querySelector(`[data-coordinate='${coordinateSkipped}']`)
  );
  const checkerSkippedEl = <HTMLDivElement>fieldSkippedEl.firstElementChild;

  if (!checkerSkippedEl) {
    alert("Not moving by rules");
    return false;
  }

  const sideSkipped = checkerSkippedEl.dataset.fieldside ? "black" : "red";

  if (sideFrom === sideSkipped) {
    alert("Cannot skip element of same color");
    return false;
  }

  return true;
};

const isMoveValid = (moveDistance: number, moveDistanceOptions: number[]) => {
  return moveDistanceOptions.some((distance) => {
    return distance === moveDistance;
  });
};

export default controller;
