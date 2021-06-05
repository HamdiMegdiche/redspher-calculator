import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { hasOperations } from "helpers";
import { Button } from "components";
import { actions } from "redux/reducers/calculator";
import { computeString } from "services";

export default function App() {
  const dispatch = useAppDispatch();
  const [operation, setOperation] = useState("");
  const [previousOperationText, setPreviousOperationText] = useState<string | null>(null);
  // Operations list selector from redux store
  const operations = useAppSelector(state => state.calculator.operations);
  const buttons = ["/", "1", "2", "3", "*", "4", "5", "6", "+", "7", "8", "9", "-", ".", "0"];

  useEffect(() => {
    window.addEventListener("keydown", handleEventKeyDownCallback);
    // CLEANUP
    return () => {
      window.removeEventListener("keydown", handleEventKeyDownCallback);
    };
  }, [operation]);

  function clear() {
    setOperation("");
    setPreviousOperationText(null);
    dispatch(actions.clearOperations());
  }

  async function handleEventKeyDownCallback(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    const keys = [...buttons, "Delete", "Backspace", "=", "Enter"];
    if (!keys.includes(e.key)) return;

    if (["Delete", "Backspace"].includes(e.key)) handleDelete();
    else if (["=", "Enter"].includes(e.key)) await compute();
    else setOperation(v => (v += e.key));
  }

  function handleDelete() {
    if (!operation.length) return;
    const newValue = operation.substring(0, operation.length - 1);
    setOperation(newValue);
  }

  async function compute() {
    if (!operation.length || !hasOperations(operation)) return;

    const [response, error] = await computeString(operation);
    if (error) {
      console.error(error);
      return;
    }
    dispatch(actions.addOperation({ value: operation, computed: response! }));
    setPreviousOperationText(`${operation}=${response}`);
    setOperation("");
  }

  return (
    <Wrapper>
      <Container>
        <Output>
          <Previous data-testid="previous-operation">{previousOperationText ?? "ANS"}</Previous>
          <Current data-testid="current-operation">{operation.length ? operation : 0}</Current>
        </Output>
        <ButtonStyled span="2" label="AC" backgroundColor="#dadce0" onClick={clear} />
        <ButtonStyled label="DEL" backgroundColor="#dadce0" onClick={handleDelete} />

        {buttons.map((b, index) => (
          <ButtonStyled
            key={`${b}-${index}`}
            label={b}
            backgroundColor={hasOperations(b) ? "#dadce0" : "#f1f3f4"}
            onClick={() => setOperation(v => (v += b))}
          />
        ))}

        <ButtonStyled
          span="2"
          label="="
          backgroundColor="#4285f4"
          color="white"
          onClick={compute}
        />
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: white;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 85px);
  grid-template-rows: repeat(7, 40px);
  gap: 2px;
`;

const Output = styled.div`
  border: 1px grey solid;
  border-radius: 10px;
  margin: 4px;
  grid-column: span 4;
  grid-row: span 2;
  font-family: monospace;
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  flex-direction: column;
  padding: 8px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: auto;
`;

const Previous = styled.span`
  font-size: 16px;
  color: #70757a;
`;
const Current = styled.span`
  font-size: 30px;
`;
const ButtonStyled = styled(Button)`
  user-select: none;
  outline: none;
  border-radius: 4px;
  margin: 4px;
`;
