import { checkExpressionToCompute, computeExpression } from "../src/helpers";

describe("Check expression to compute function", () => {
  it("Checks allowing simple numbers", () => {
    expect(checkExpressionToCompute("123")).toBe(true);
    expect(checkExpressionToCompute("23.45")).toBe(true);
    expect(checkExpressionToCompute("3.-3")).toBe(true);
    expect(checkExpressionToCompute(".45")).toBe(true);
    expect(checkExpressionToCompute("-123")).toBe(true);
    expect(checkExpressionToCompute("-273.15")).toBe(true);
    expect(checkExpressionToCompute("-42.")).toBe(true);
    expect(checkExpressionToCompute("-.45")).toBe(true);
  });

  it("Checks disallowing multiple successive operations in the beginning", () => {
    expect(checkExpressionToCompute(".5+-.5")).toBe(false);
    expect(checkExpressionToCompute("--5.3+6-9*9")).toBe(false);
    expect(checkExpressionToCompute("+-5.3+6-9*9")).toBe(false);
    expect(checkExpressionToCompute("+*5.3+6-9*9")).toBe(false);
    expect(checkExpressionToCompute("/5.3+6-9*9")).toBe(false);
    expect(checkExpressionToCompute("*5.3+6-9*9")).toBe(false);
  });
  it("Checks disallowing multiple successive operations in the middle", () => {
    expect(checkExpressionToCompute("5.3++6-9*9")).toBe(false);
    expect(checkExpressionToCompute("5.3+6--9*9")).toBe(false);
    expect(checkExpressionToCompute("5.3+6-9*+9")).toBe(false);
    expect(checkExpressionToCompute("5.3+6-9**9")).toBe(false);
    expect(checkExpressionToCompute("5.3+6-9*9//3")).toBe(false);
  });
  it("Checks allowing digits after floating point without having digits before", () => {
    expect(checkExpressionToCompute("-.3+6")).toBe(true);
    expect(checkExpressionToCompute("-3+.6")).toBe(true);
    expect(checkExpressionToCompute("-3+0.6")).toBe(true);
  });
});

describe("Compute expressions", () => {
  it("Computes simple expression", () => {
    expect(computeExpression("123")).toBe("123");
    expect(computeExpression("5+.5")).toBe("5.5");
    expect(computeExpression(".5+.5")).toBe("1");
    expect(computeExpression(".5-.5")).toBe("0");
    expect(computeExpression(".5+-.5")).toBe("0");
    expect(computeExpression(".5+--.5")).toBe("0");
    expect(computeExpression("5.+2")).toBe("7");
  });

  it("Computes expression with floating point", () => {
    expect(computeExpression("0.00005+0.00004")).toBe("0.00009");
    // NOTE using BigNumber fixes the floating decimal issue
    // with basic arithmetic js : 3*3.3 = 9.899999999999999
    expect(computeExpression("3*3.3")).toBe("9.9");
  });

  it("Computes expression & respect the right order : / * - + ", () => {
    expect(computeExpression("-1/3*0")).toBe("0");
    expect(computeExpression("1/3*0")).toBe("0");
    expect(computeExpression("1/3*0-2+3")).toBe("1");
  });

  it("Computes infinity case ", () => {
    expect(computeExpression("1/0")).toBe("∞");
    expect(computeExpression("1/0")).toBe("∞");
    expect(computeExpression("-3*0/0")).toBe("∞");
    expect(computeExpression("-3/0*0")).toBe("∞");
  });
});
