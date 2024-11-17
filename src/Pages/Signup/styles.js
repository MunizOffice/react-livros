import styled from "styled-components";

export const BackButton = styled.button`
  position: absolute;
  top: 5%;
  right: 5%;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f7f;
  }
`;

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
  max-width: 500px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 1px 2px #0003;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  min-height: 400px; 
`;


export const Label = styled.label`
  font-weight: 600;
  font-size: 36px;
  color: #676767;
`;


export const Names = styled.label`
  font-weight: 200;
  font-size: 22px;
  color: #676767;
  text-align: left; 
  width: 100%; 
  display: block; 
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
