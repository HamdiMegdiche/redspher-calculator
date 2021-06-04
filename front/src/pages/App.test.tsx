import { render, RenderResult, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "redux/store";
import App from "./App";

const renderApp = (): RenderResult =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

it("Renders properly", async () => {
  const { asFragment, getByText } = renderApp();
  // const textElement = getByText(/Redspher Calculator/i);
  const textElement = await screen.findByText(/Redspher Calculator/i);
  expect(asFragment()).toMatchSnapshot();
  expect(textElement).toBeInTheDocument();
  expect(store.getState().calculator.operations).toEqual([])
});
