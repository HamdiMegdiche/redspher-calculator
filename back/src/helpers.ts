/**
 * Using BigNumber library :
 *   - To fix issue floating point number precision in JavaScript (following the international IEEE 754 standard )
 *   - To compute big numbers
 */
import { BigNumber } from "bignumber.js";

/**
 * Expression strict checking
 * @param expression string to check
 */
export function checkExpressionToCompute(expression: string): boolean {
  //  This will math a number (with decimal point) followed by an operator and a number indefinitely
  const regex = /(-?((\d+(\.\d*)?)|(\.\d+)))([-+\/*](((\d+(\.\d*)?)|(\.\d+))))*/;
  const matches = expression.match(regex);
  if (!matches?.length) return false;

  //   Regex 1st matches array (1st capturing group) must be equal to given string
  return expression === matches[0];
}

/**
 * parse expression that only have / operator
 * @param expression string to compute has only operations /
 */
function parseDivisionSeparatedExpression(expression: string): BigNumber {
  // Split expression with the 4th least operation order
  const numbersString = expression.split("/");
  const numbers = numbersString.map(noStr => +noStr); // Convert to number
  const initialValue = new BigNumber(numbers[0]);
  const result = numbers.slice(1).reduce((acc, num) => acc.div(num), initialValue);
  return result;
}

/**
 * parse expression according to math order of operations: / *
 * @param expression string to compute has only operations / *
 */
function parseMultiplicationSeparatedExpression(expression: string): BigNumber {
  // Split expression with the 3rd least operation order
  const numbersString = expression.split("*");
  const numbers = numbersString.map(parseDivisionSeparatedExpression);
  const initialValue = new BigNumber(1.0);
  const result = numbers.reduce((acc, num) => acc.times(num), initialValue);
  return result;
}

/**
 * parse expression according to math order of operations: / * -
 * @param expression string to compute has only operations / * -
 */
function parseMinusSeparatedExpression(expression: string): BigNumber {
  // Split expression with the 2nd least operation order
  const numbersString = expression.split("-");
  const numbers = numbersString.map(parseMultiplicationSeparatedExpression);
  const initialValue = new BigNumber(numbers[0]);
  const result = numbers.slice(1).reduce((acc, num) => acc.minus(num), initialValue);
  return result;
}

/**
 * Compute expression according to math order of operations: / * - +
 * @param expression string to compute has all operations
 */
export function computeExpression(expression: string): string {
  // Split expression with the least operation order
  const numbersString = expression.split("+");
  const numbers = numbersString.map(parseMinusSeparatedExpression);
  const initialValue = new BigNumber(0.0);
  const result = numbers.reduce((acc, num) => acc.plus(num), initialValue);
  const resultStr = result.toString();
  // Handle Infinity case
  if (resultStr === "-Infinity") return "-∞";
  else if (["Infinity", "NaN"].includes(resultStr)) return "∞";
  return resultStr;
}
