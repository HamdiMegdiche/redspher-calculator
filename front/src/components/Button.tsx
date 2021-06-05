import styled from "styled-components";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  span?: string;
  label?: string;
  color?: string;
  backgroundColor?: string;
}

const defaultProps: Props = {
  backgroundColor: "#f1f3f4",
  color: "black"
};
export function Button(props: Props = defaultProps) {
  return (
    <ButtonStyled className={props.className} {...props}>
      {props?.label}
    </ButtonStyled>
  );
}

Button.defaultProps = defaultProps;

const ButtonStyled = styled.button`
  cursor: pointer;
  grid-column: span ${(props: Props) => props.span};
  border: 1px solid ${(props: Props) => props.backgroundColor};
  background-color: ${(props: Props) => props.backgroundColor};
  color: ${(props: Props) => props.color};
  font-size: 14px;
  :hover {
    opacity: 0.8;
  }
`;
