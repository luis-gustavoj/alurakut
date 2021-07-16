import Image from "next/image";

import styled from "styled-components";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

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

const ProfileRelationsBox = ({ data, title }) => {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({data.length})
      </h2>
      <ul>
        {data.slice(0, 6).map((currentItem) => {
          return (
            <li key={currentItem.id}>
              <a href={`/users/${currentItem.login}`}>
                <img
                  src={`https://github.com/${currentItem.login}.png`}
                  alt={`${currentItem.login} avatar`}
                />
                <span>{currentItem.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 14px;
`;

const ScrapBox = styled(Box)`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  span {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    display: flex;

    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;

    color: #5a5a5a;
    font-size: 0.8rem;

    h1 {
      font-size: 1rem;
      font-weight: 400;
      color: #000;
    }
  }

  p {
    max-width: 550px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function Home() {
  const githubUser = "luis-gustavoj";
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [selectedOption, setSelectedOption] = useState(true);

  const fetchFollowersData = async () => {
    try {
      const data = await fetch(
        `https://api.github.com/users/${githubUser}/followers`
      );
      const parsedData = await data.json();
      setFollowers(parsedData);
    } catch (error) {
      throw new Error(`Aconteceu algum erro :( ${error}`);
    }
  };

  const fetchFollowingData = async () => {
    try {
      const data = await fetch(
        `https://api.github.com/users/${githubUser}/following`
      );
      const parsedData = await data.json();
      setFollowing(parsedData);
    } catch (error) {
      throw new Error(`Aconteceu algum erro :( ${error}`);
    }
  };

  const fetchGraphQL = () => {
    fetch("https://graphql.datocms.com", {
      method: "POST",
      headers: {
        Authorization: "6ed1030987a58872f1adfa4f9a5afc",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          title
          id
          imageUrl
          creatorslug
        }
        allScraps {
          senderSlug
          description
          id
          createdDate
        }
      }`,
      }),
    })
      .then((response) => response.json())
      .then((parsedResponse) => {
        setScraps(parsedResponse.data.allScraps);
        setCommunities(parsedResponse.data.allCommunities);
      });
  };

  useEffect(() => {
    fetchFollowersData();
    fetchFollowingData();
    fetchGraphQL();
  }, []);

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
            <OrkutNostalgicIconSet
              confiavel={3}
              legal={2}
              sexy={0}
              recados={scraps.length}
            />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <ButtonContainer>
              <button
                onClick={() => {
                  setSelectedOption(true);
                }}
              >
                Criar uma comunidade
              </button>
              <button onClick={() => setSelectedOption(false)}>
                Deixar um recado
              </button>
            </ButtonContainer>
            {selectedOption ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const community = {
                    title: e.target.title.value,
                    imageUrl: e.target.image.value,
                    creatorslug: githubUser,
                  };

                  fetch("/api/communities", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      type: "community",
                    },
                    body: JSON.stringify(community),
                  }).then(async (res) => {
                    const data = await res.json();
                    const updatedCommunities = [
                      data.registerSucceeded,
                      ...communities,
                    ];
                    setCommunities(updatedCommunities);
                  });
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
                <button>Criar comunidade</button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const scrap = {
                    senderSlug: e.target.scrapSenderName.value
                      ? e.target.scrapSenderName.value
                      : "Anônimo",
                    description: e.target.scrapDescription.value,
                    createdDate: new Date(),
                  };

                  fetch("/api/communities", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      type: "scrap",
                    },
                    body: JSON.stringify(scrap),
                  }).then(async (res) => {
                    const data = await res.json();
                    const updatedScraps = [data.registerSucceeded, ...scraps];
                    setScraps(updatedScraps);
                  });
                }}
              >
                <div>
                  <input
                    placeholder="Qual o seu nome?"
                    name="scrapSenderName"
                    aria-label="Qual o seu nome?"
                    type="text"
                  />
                </div>
                <div>
                  <input
                    placeholder="Digite o seu recado"
                    name="scrapDescription"
                    aria-label="Digite o seu recado"
                  />
                </div>
                <button>Deixar recado</button>
              </form>
            )}
          </Box>
          <Box>
            <h2 className="subTitle">Recados</h2>
            {scraps.slice(0, 8).map((scrap) => {
              return (
                <ScrapBox key={scrap.id}>
                  <span>
                    <h1>{scrap.senderSlug}</h1>
                    {format(parseISO(scrap.createdDate), "PPpp", {
                      locale: ptBR,
                    })}
                  </span>
                  <p>{scrap.description}</p>
                </ScrapBox>
              );
            })}
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
                    <a href={`/communities/${community.id}`}>
                      <img src={community.imageUrl} alt={community.title} />
                      <span>{community.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox data={followers} title="Seguidores" />
          <ProfileRelationsBox data={following} title="Pessoas da comunidade" />
        </div>
      </MainGrid>
    </>
  );
}
