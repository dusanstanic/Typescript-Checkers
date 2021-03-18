type MoveTwoSpace = {
  coordinateFrom: number;
  coordinateSkipped: number;
  fieldElTo: HTMLDivElement;
  checkerElFrom: HTMLDivElement;
};

export const removeCheckerFromField1 = (checker: HTMLDivElement) => {
  const field = checker.parentElement!;
  field.dataset.isCheckerField = "false";
  checker.parentElement?.removeChild(checker);
};

export const undoRemoveCheckerFromField = (
  checker: HTMLDivElement,
  field: HTMLDivElement
) => {
  field.dataset.isCheckerField = "true";
  field.append(checker);
};

export const moveCheckerToField = (
  fieldFrom: HTMLDivElement,
  fieldTo: HTMLDivElement,
  checkerFrom: HTMLDivElement
) => {
  fieldFrom.dataset.isCheckerField = "false";
  fieldTo.dataset.isCheckerField = "true";
  checkerFrom.classList.add("active");
  fieldTo.append(checkerFrom);
};

export const undoMoveCheckerToField = (
  fieldFrom: HTMLDivElement,
  fieldTo: HTMLDivElement,
  checkerFrom: HTMLDivElement
) => {
  fieldFrom.dataset.isCheckerField = "false";
  fieldTo.dataset.isCheckerField = "true";
  checkerFrom.classList.remove("active");
  fieldTo.append(checkerFrom);
};

export class MoveOneSpaceCommand {
  moveCheckerToField: MoveCheckerToFieldCommand;

  constructor(
    coordinateFrom: number,
    fieldElTo: HTMLDivElement,
    checkerElFrom: HTMLDivElement
  ) {
    this.moveCheckerToField = new MoveCheckerToFieldCommand(
      fieldElTo,
      checkerElFrom,
      coordinateFrom
    );
  }

  execute = () => {
    this.moveCheckerToField.execute();
  };

  undo = () => {
    this.moveCheckerToField.undo();
  };
}

export class MoveTwoSpaceCommand {
  moveCheckerToField: MoveCheckerToFieldCommand;
  removeCheckFromField: RemoveCheckerFromFieldCommand;

  constructor({
    checkerElFrom,
    coordinateFrom,
    coordinateSkipped,
    fieldElTo,
  }: MoveTwoSpace) {
    this.moveCheckerToField = new MoveCheckerToFieldCommand(
      fieldElTo,
      checkerElFrom,
      coordinateFrom
    );
    this.removeCheckFromField = new RemoveCheckerFromFieldCommand(
      coordinateSkipped
    );
  }

  execute = () => {
    this.removeCheckFromField.execute();
    this.moveCheckerToField.execute();
  };

  undo = () => {
    this.removeCheckFromField.undo();
    this.moveCheckerToField.undo();
  };
}

class MoveCheckerToFieldCommand {
  fieldElTo: HTMLDivElement;
  checkerElFrom: HTMLDivElement;
  fieldElFrom: HTMLDivElement;

  constructor(
    fieldElTo: HTMLDivElement,
    checkerElFrom: HTMLDivElement,
    coordinateFrom: number
  ) {
    this.fieldElTo = fieldElTo;
    this.checkerElFrom = checkerElFrom;
    this.fieldElFrom = <HTMLDivElement>(
      document.querySelector(`[data-coordinate='${coordinateFrom}']`)
    );
  }

  execute = () => {
    moveCheckerToField(this.fieldElFrom, this.fieldElTo, this.checkerElFrom);
  };

  undo = () => {
    undoMoveCheckerToField(
      this.fieldElTo,
      this.fieldElFrom,
      this.checkerElFrom
    );
  };
}

class RemoveCheckerFromFieldCommand {
  checker: HTMLDivElement;
  field: HTMLDivElement;

  constructor(coordinate: number) {
    this.field = <HTMLDivElement>(
      document.querySelector(`[data-coordinate='${coordinate}']`)
    );

    this.checker = <HTMLDivElement>this.field.firstElementChild;
  }

  execute = () => {
    removeCheckerFromField1(this.checker);
  };

  undo = () => {
    undoRemoveCheckerFromField(this.checker, this.field);
  };
}
