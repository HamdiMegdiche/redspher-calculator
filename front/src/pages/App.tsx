import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "redux/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  // Operations list selector from redux store
  const operations = useAppSelector(state => state.calculator.operations);

  return <Container>Redspher Calculator</Container>;
}

const Container = styled.div`
  margin: 0;
`;
