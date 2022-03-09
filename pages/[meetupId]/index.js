import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

// getStaticPaths function needed to use getStaticProps
export async function getStaticPaths() {
  const username = process.env.NEXT_PUBLIC_DB_USERNAME;
  const password = process.env.NEXT_PUBLIC_DB_PASSWORD;
  const client = await MongoClient.connect(
    `mongodb+srv://${username}:${password}@cluster0.hsgly.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  // in find, empty object means get all objects, _id: 1 means just the id's for each object
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    // fallback false means all paths are defined, true means dynamic
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for single meetup
  const meetupId = context.params.meetupId;
  const username = process.env.NEXT_PUBLIC_DB_USERNAME;
  const password = process.env.NEXT_PUBLIC_DB_PASSWORD;
  const client = await MongoClient.connect(
    `mongodb+srv://${username}:${password}@cluster0.hsgly.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
