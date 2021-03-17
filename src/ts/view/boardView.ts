import elements from "../base/boardBase";
import checkerState from "../checkerState";

export const renderChessField = (
  isCheckerField: boolean,
  side: string = "red",
  coordinate = "1"
) => {
  let markup = `
    <div class="checker__field" data-coordinate=${coordinate} data-isCheckerField=${isCheckerField}>
    </div>`;

  if (isCheckerField) {
    const fieldSide = side === "black" ? "black" : "";

    markup = `
        <div class="checker__field" data-coordinate=${coordinate} data-isCheckerField=${isCheckerField}>
            <div draggable="true" class="checker checker--${fieldSide}" data-fieldSide=${fieldSide}></div>
        </div>`;
  }

  elements.board?.insertAdjacentHTML("beforeend", markup);
};

export const renderChessFields = (rows = 8, columns = 8) => {
  for (let i = 1; i <= rows; i++) {
    const type = i >= 6 ? "black" : "red";
    const rowStartsWithChecker = i % 2 === 0;

    for (let j = 0; j < columns; j++) {
      if (i > 3 && i < 6) {
        renderChessField(false, type, `${i}${j}`);
        continue;
      }

      if (rowStartsWithChecker && j % 2 === 1) {
        renderChessField(true, type, `${i}${j}`);
        continue;
      }

      if (!rowStartsWithChecker && j % 2 === 0) {
        renderChessField(true, type, `${i}${j}`);
        continue;
      }

      renderChessField(false, type, `${i}${j}`);
    }
  }
};
