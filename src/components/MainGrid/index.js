import styled from "styled-components";

export const MainGrid = styled.main`
  display: grid;

  width: 100%;
  max-width: 500px;

  margin: 0 auto 0 auto;
  padding: 16px;
  grid-gap: 10px;

  .profileArea {
    display: none;

    @media (min-width: 860px) {
      display: block;
    }
  }

  .profileAvatar {
  }

  @media (min-width: 860px) {
    display: grid;

    max-width: 1110px;
    grid-template-areas: "profileArea welcomeArea profileRelationsArea";
    grid-template-columns: 160px 1fr 312px;
  }
`;
