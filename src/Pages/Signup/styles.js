import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 350px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 1px 2px #0003;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 36px;
  color: #676767;
`;

export const LabelSignin = styled.label`
  font-size: 16px;
  color: #676767;
`;

export const labelError = styled.label`
  font-size: 14px;
  color: red;
`;

export const Strong = styled.strong`
  cursor: pointer;

  a {
    color: #676767;
    text-decoration: none;
  }
`;
