export const removeCheckerFromField = (coordinate: number) => {
  const field = <HTMLDivElement>(
    document.querySelector(`[data-coordinate='${coordinate}']`)
  );
  const checker = <HTMLDivElement>field.firstElementChild;

  field.dataset.ischeckerfield = "false";

  checker.parentElement?.removeChild(checker);
};

export const moveCheckerToField = (
  fieldTo: HTMLDivElement,
  checkerFrom: HTMLDivElement
) => {
  fieldTo.dataset.ischeckerfield = "true";
  checkerFrom.classList.add("active");
  fieldTo.append(checkerFrom);
};

interface SkipElement {
  coordinateFrom: number;
  coordinateSkipped: number;
  fieldElTo: HTMLDivElement;
  checkerElFrom: HTMLDivElement;
}

export const skipElement = ({
  coordinateFrom,
  coordinateSkipped,
  checkerElFrom,
  fieldElTo,
}: SkipElement) => {
  removeCheckerFromField(coordinateFrom);
  removeCheckerFromField(coordinateSkipped);
  moveCheckerToField(fieldElTo, checkerElFrom);
};
