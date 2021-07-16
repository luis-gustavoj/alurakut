import Image from "next/image";

import { useEffect, useState } from "react";

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

export default function Home() {
  const githubUser = "luis-gustavoj";
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [communities, setCommunities] = useState([]);

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
      }`,
      }),
    })
      .then((response) => response.json())
      .then((parsedResponse) => {
        console.log(parsedResponse);
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
            <OrkutNostalgicIconSet confiavel={3} legal={2} sexy={0} />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
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
                  },
                  body: JSON.stringify(community),
                }).then(async (res) => {
                  const data = await res.json();
                  const updatedCommunties = [
                    ...communities,
                    data.registerSucceeded,
                  ];
                  setCommunities(updatedCommunties);
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
