import styled from 'styled-components';

export const QuizCard = styled.div`
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  padding: 20px;
  background-color: #edd9fa;
  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const QuizTitle = styled.h2`
  text-decoration: underline;
  text-align: center;
  @media (max-width: 500px) {
    margin-right: 5px;
    font-size: 15pt;
  }
`;

function createButton(background, inverted) {
  return styled.button`
    background-color: ${background};
    color: ${inverted ? 'white' : 'black'};
    margin: 10px;
    padding: 15px;
    border-radius: 5px;
    border: none;
    font-size: 12pt;
    @media (max-width: 500px) {
      font-size: 8pt;
    }
  `;
}

export const Modal = styled.div`
  position: fixed; 
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%;
  overflow: auto; 
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4);
`;

export const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto; 
  padding: 20px;
  border: 1px solid #888;
  width: 90%; 
`;

export const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover {
      color: black;
      text-decoration: none;
      cursor: pointer;
  }
`;

export const AnswerField = styled.div`
  display: flex;
`;

export const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

export const Button = createButton('#b497f7', true);
export const CreateGameButton = createButton('#66ebfa', true);
