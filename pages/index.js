import Image from "next/image";

import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

const ProfileSidebar = ({ githubUser }) => {
  return (
    <Box>
      <Image
        className="profileAvatar"
        width={320}
        height={320}
        layout="responsive"
        src={`https://github.com/${githubUser}.png`}
      ></Image>
    </Box>
  );
};

export default function Home() {
  const githubUser = "luis-gustavoj";
  const favoriteRelations = ["omariosouto", "juunegreiros", "peas", "diego3g"];

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet confiavel={3} legal={2} sexy={0} />
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoriteRelations.length})
            </h2>
            <ul>
              {favoriteRelations.map((favPerson) => {
                return (
                  <li>
                    <a href={`/users/${favPerson}`} key={favPerson}>
                      <img
                        src={`https://github.com/${favPerson}.png`}
                        alt={`${favPerson} avatar`}
                      />
                      <span>{favPerson}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
