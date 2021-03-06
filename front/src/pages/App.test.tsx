import { fireEvent, render, RenderResult, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "redux/store";
import App from "./App";

import * as services from "services";
import { act } from "react-dom/test-utils";
const mockCompute = jest.spyOn(services, "computeString");

const renderApp = (): RenderResult =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

it("Renders properly", async () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  const prevOperation = await screen.findByText("ANS");
  expect(prevOperation).toBeInTheDocument();
  // There is 2 zeros : a button and current operation
  const zeroElements = await screen.findAllByText("0");
  expect(zeroElements).toHaveLength(2);
  expect(store.getState().calculator.operations).toEqual([]);
});

it("Current operation correctly changes after click", async () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  const button1 = await screen.getByText("1");
  const buttonPlus = await screen.getByText("+");
  const button2 = await screen.getByText("2");
  fireEvent.click(button1);
  fireEvent.click(buttonPlus);
  fireEvent.click(button2);
  const currentOperation = await screen.getByTestId("current-operation");
  expect(currentOperation.textContent).toEqual("1+2");
});

it("Current operation correctly changes after keydown", async () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  fireEvent.keyDown(document, { key: "1" });
  fireEvent.keyDown(document, { key: "+" });
  fireEvent.keyDown(document, { key: "2" });
  fireEvent.keyDown(document, { key: "+" });
  fireEvent.keyDown(document, { key: "Backspace" });
  const currentOperation = screen.getByTestId("current-operation");
  expect(currentOperation.textContent).toEqual("1+2");
});

it("Current operation correctly changes after Clear", () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  const buttonAC = screen.getByText("AC");
  fireEvent.keyDown(document, { key: "1" });
  fireEvent.keyDown(document, { key: "+" });
  fireEvent.keyDown(document, { key: "2" });
  fireEvent.keyDown(document, { key: "2" });
  fireEvent.click(buttonAC);
  const currentOperation = screen.getByTestId("current-operation");
  expect(currentOperation.textContent).toEqual("0");
  expect(store.getState().calculator.operations).toEqual([]);
});

it("Displays history perperly", async () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  const historyIcon = screen.getByTestId("history-icon");
  expect(historyIcon).toBeInTheDocument();
  act(async () => {
    fireEvent.click(historyIcon);
    // history operations div is hidden at first (must click on icon)
    const history = await screen.getByTestId("history-operations");
    expect(history.textContent).toEqual("");
  });
});

it("Checks Previous & Current operations correctly changes after compute API Call", async () => {
  const { asFragment } = renderApp();
  expect(asFragment()).toMatchSnapshot();
  act(async () => {
    const currentOperation = await screen.getByTestId("current-operation");
    fireEvent.keyDown(currentOperation, { key: "1" });
    fireEvent.keyDown(currentOperation, { key: "+" });
    fireEvent.keyDown(currentOperation, { key: "2" });
    expect(currentOperation.textContent).toEqual("1+2");
    fireEvent.keyDown(document, { key: "Enter" });
    await mockCompute.mockResolvedValue(["3", null]);
    const previousOperation = await screen.getByTestId("previous-operation");
    expect(previousOperation.textContent).toEqual("1+2=3");
    expect(currentOperation.textContent).toEqual("0");
    const operations = store.getState().calculator.operations;
    expect(operations).toEqual([{ value: "1+2", computed: "3" }]);
  });
});
