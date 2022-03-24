import styled from 'styled-components';

export const TaskHeaderStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 0.75fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  background-color: #42a5f5;
  color: white;
  padding: 24px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  gap: 10px;
`;

export const ButtonsWrapperStyled = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

export const TasksWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TaskWrapperStyled = styled.div`
  padding: 16px 0 16px 16px;
`;