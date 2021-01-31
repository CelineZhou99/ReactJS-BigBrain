import styled, { css } from 'styled-components';

export const ButtonStyle = css`
  border: 0;
  border-radius: 5px;
  width: 100%;
  height: 50px;
  font-size: 13pt;
  color: white;
  cursor: pointer;
`;

export const FormStyle = css`
  display: flex;
  flex-direction: column;
  padding: 1%;
  box-shadow: 0 8px 20px 0px rgb(173, 173, 173);
`;
function createSubmitWithColor(backgroundColor, inverted) {
  return styled.input`
    ${ButtonStyle};
    background-color: ${backgroundColor};
    color: ${inverted ? 'white' : 'black'};
  `;
}

function createButtonWithColor(backgroundColor, inverted) {
  return styled.button`
    ${ButtonStyle};
    background-color: ${backgroundColor};
    color: ${inverted ? 'white' : 'black'};
  `;
}

export const Form = styled.form`
  ${FormStyle}
  margin: 5% 30%;
  @media (max-width: 700px) {
    margin: 5% 20%;
  }

  @media (max-width: 500px) {
    margin: 5% 10%;
  }
`;

export const ModalForm = styled.form`
  ${FormStyle}
  margin: 5% 5%;
`;

export const SignInInput = createSubmitWithColor('#b497f7', true);

export const SignUpInput = createSubmitWithColor('#66ebfa', true);

export const SignInButton = createButtonWithColor('#b497f7', true);

export const SignUpButton = createButtonWithColor('#66ebfa', true);

export const SubmitButton = createButtonWithColor('#b497f7', true);

export const PurpleInput = createSubmitWithColor('#b497f7', true);

export const BlueInput = createSubmitWithColor('#66ebfa', true);
