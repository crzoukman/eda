import styled from "styled-components";

export const LoginIconStyled = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    cursor: pointer;
  }
`;

export const UserAvatarWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;