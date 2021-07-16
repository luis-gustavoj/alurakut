import { SiteClient } from "datocms-client";

export default async function requestReceiver(request, response) {
  if (request.method === "POST") {
    const TOKEN = process.env.DATO_TOKEN;
    const client = new SiteClient(TOKEN);

    if (request.headers.type === "community") {
      const communityData = await client.items.create({
        itemType: "968444",
        ...request.body,
      });

      response.json({
        registerSucceeded: communityData,
      });
    }

    if (request.headers.type === "scrap") {
      const scrapData = await client.items.create({
        itemType: "975109",
        ...request.body,
      });

      response.json({
        registerSucceeded: scrapData,
      });
    }
  }
}
