import { checkIfPlayerWon } from "../checkerState";

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
      checkIfPlayerWon();
    });
  });
};

const isMoveAllowed = (event: DragEvent, toEl: HTMLDivElement) => {};

export default controller;
