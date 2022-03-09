// url for this page would be /api/new-meetup
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    // const { title, image, address, description } = data;
    // take these and then store in database
    const username = process.env.NEXT_PUBLIC_DB_USERNAME;
    const password = process.env.NEXT_PUBLIC_DB_PASSWORD;
    const client = await MongoClient.connect(
      `mongodb+srv://${username}:${password}@cluster0.hsgly.mongodb.net/meetups?retryWrites=true&w=majority`
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);
    console.log(result);
    client.close();
    res.status(201).json({ message: "Meetup inserted.." });
  }
}
