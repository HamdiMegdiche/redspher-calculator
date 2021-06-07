import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks";
import { hasOperations } from "helpers";
import { computeString } from "services";
import { actions } from "redux/reducers/calculator";
import { Button } from "components";

export default function App() {
  const dispatch = useAppDispatch();
  const [currentOperation, setCurrentOperation] = useState("");
  const [previousOperationText, setPreviousOperationText] = useState<string | null>(null);
  const [showOperations, setShowOperations] = useState(false);
  const [error, setError] = useState("");
  // Operations list selector from redux store
  const operations = useAppSelector(state => state.calculator.operations);
  const buttons = ["/", "1", "2", "3", "*", "4", "5", "6", "+", "7", "8", "9", "-", ".", "0"];

  useEffect(() => {
    window.addEventListener("keydown", handleEventKeyDownCallback);
    // CLEANUP
    return () => {
      window.removeEventListener("keydown", handleEventKeyDownCallback);
    };
  }, [currentOperation]);

  function clear() {
    setCurrentOperation("");
    setError("");
    setPreviousOperationText(null);
    dispatch(actions.clearOperations());
  }

  async function handleEventKeyDownCallback(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    const keys = [...buttons, "Delete", "Backspace", "=", "Enter"];
    if (!keys.includes(e.key)) return;

    if (["Delete", "Backspace"].includes(e.key)) handleDelete();
    else if (["=", "Enter"].includes(e.key)) await compute();
    else setCurrentOperation(v => (v += e.key));
  }

  function handleDelete() {
    if (!currentOperation.length) return;
    const newValue = currentOperation.substring(0, currentOperation.length - 1);
    setCurrentOperation(newValue);
  }

  async function compute() {
    if (!currentOperation.length || !hasOperations(currentOperation)) return;
    setError("");

    const [res, err] = await computeString(currentOperation);
    if (err) {
      setError(err.error);
      return;
    }
    const computed = res?.computed;
    dispatch(actions.addOperation({ value: currentOperation, computed: computed! }));

    // smooth scroll to top (show recent operation)
    const historyDiv = document.getElementById("history");
    historyDiv?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPreviousOperationText(`${currentOperation}=${computed}`);
    setCurrentOperation("");
  }

  return (
    <Wrapper>
      <Container>
        {showOperations /*&& !!operations.length*/ && (
          <History id="history" data-testid="history-operations" title="Operations history">
            {operations.map((op, index) => (
              <div key={"op-" + index}>{`${op.value}=${op.computed}`}</div>
            ))}
          </History>
        )}
        <Output>
          <IconHistory
            data-testid="history-icon"
            title={`${showOperations ? "Hide" : "Show"} history`}
            onClick={() => setShowOperations(show => !show)}>
            ⎌
          </IconHistory>
          <Previous data-testid="previous-operation">{previousOperationText ?? "ANS"}</Previous>
          <Current data-testid="current-operation">
            {currentOperation.length ? currentOperation : 0}
          </Current>
        </Output>
        <ButtonStyled span="2" label="AC" backgroundColor="#dadce0" onClick={clear} />
        <ButtonStyled label="DEL" backgroundColor="#dadce0" onClick={handleDelete} />

        {buttons.map((b, index) => (
          <ButtonStyled
            key={`${b}-${index}`}
            label={b}
            backgroundColor={hasOperations(b) ? "#dadce0" : "#f1f3f4"}
            onClick={() => setCurrentOperation(v => (v += b))}
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
      <Error>{error}</Error>
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
  grid-template-rows: repeat(11, 40px);
  gap: 2px;
`;

const History = styled.div`
  border: 1px grey solid;
  border-radius: 10px;
  margin: 4px;
  grid-row: span 4;
  font-family: monospace;
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 8px;
  word-wrap: break-word;
  word-break: break-all;
  overflow: auto;
`;

const IconHistory = styled.div`
  position: absolute;
  top: 0;
  left: 8px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 800;

  :hover {
    opacity: 0.8;
  }
`;

const Output = styled.div`
  position: relative;
  border: 1px grey solid;
  border-radius: 10px;
  margin: 4px;
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

const Error = styled.div`
  color: #ff0101;
  font-size: 16px;
`;
