import styled from "styled-components";

export const Button = styled.button`
  width: 100%;
  max-width: 350px;
  padding: 16px 20px;
  background-color: #046ee5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  outline: none;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f7f;
  }
`;
