import elements from "../base/boardBase";
import * as boardView from "../view/boardView";

const boardController = () => {
  const boarder = <HTMLDivElement>elements.board;

  boardView.renderChessFields();
};

export default boardController;
