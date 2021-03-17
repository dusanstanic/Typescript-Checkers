import elements from "../base/boardBase";
import * as boardView from "../view/boardView";
import checkerState, {
  resetCheckerState,
  updateCheckerUI,
} from "../checkerState";
import searchCtrl from "../controllers/checker";

const boardController = () => {
  const boarder = <HTMLDivElement>elements.board;
  const newGameBtn = <HTMLButtonElement>elements.newGameBtn;

  newGameBtn.addEventListener("click", () => {
    boarder.innerHTML = "";

    resetCheckerState();
    updateCheckerUI();

    boardView.renderChessFields();
    searchCtrl();
  });

  updateCheckerUI();
  boardView.renderChessFields();
};

export default boardController;
