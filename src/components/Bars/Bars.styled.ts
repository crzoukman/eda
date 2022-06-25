import styled from 'styled-components';

export const BarsStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  gap: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  margin-bottom: 40px;
  overflow: hidden;
  max-width: 600px;
`;

export const BarStyled = styled.div<{
  color: string;
  completed: number;
}>`
  background-color: ${({ color }) => color};
  border-radius: 10px;
  height: 20px;
  opacity: ${({ completed }) => completed};
`;
