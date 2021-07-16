import { SiteClient } from "datocms-client";

export default async function requestReceiver(request, response) {
  if (request.method === "POST") {
    const TOKEN = process.env.DATO_TOKEN;
    const client = new SiteClient(TOKEN);

    const communityData = await client.items.create({
      itemType: "968444",
      ...request.body,
    });

    console.log(communityData);

    response.json({
      registerSucceeded: communityData,
    });
  }
}
