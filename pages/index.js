import Image from "next/image";

import { useState } from "react";

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

const ProfileSidebar = ({ githubUser }) => {
  return (
    <Box as="aside">
      <Image
        className="profileAvatar"
        width={320}
        height={320}
        layout="responsive"
        src={`https://github.com/${githubUser}.png`}
      ></Image>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
};

export default function Home() {
  const githubUser = "luis-gustavoj";
  const favoriteRelations = [
    "omariosouto",
    "juunegreiros",
    "peas",
    "diego3g",
    "filipedeschamps",
    "felipefialho",
    "placeholder",
    "placeholder",
    "placeholder",
  ];
  const [communities, setCommunities] = useState([
    {
      id: "231321321312",
      name: "Eu odeio acordar cedo",
      url: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
      link: "https://alura.com.br",
    },
  ]);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet confiavel={3} legal={2} sexy={0} />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCommunities([
                  ...communities,
                  {
                    id: new Date().toISOString,
                    name: e.target.title.value,
                    url: e.target.image.value,
                    link: e.target.link.value,
                  },
                ]);
              }}
            >
              <div>
                <input
                  placeholder="Qual o nome de sua comunidade?"
                  name="title"
                  aria-label="Qual o nome de sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Qual o URL de sua foto de capa?"
                  name="image"
                  aria-label="Qual o URL de sua foto de capa?"
                />
              </div>
              <div>
                <input
                  placeholder="Qual o URL de sua comunidade?"
                  name="link"
                  type="text"
                  aria-label="Qual o URL de sua comunidade?"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({communities.length})</h2>
            <ul>
              {communities.slice(0, 6).map((community) => {
                return (
                  <li key={community.id}>
                    <a href={community.link}>
                      <img src={community.url} alt={`${community.name}`} />
                      <span>{community.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoriteRelations.length})
            </h2>
            <ul>
              {favoriteRelations.slice(0, 6).map((favPerson) => {
                return (
                  <li key={favPerson}>
                    <a href={`/users/${favPerson}`}>
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
