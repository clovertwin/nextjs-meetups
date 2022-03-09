import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta
          name="description"
          content="Browse a list of meetup spots and good times."
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// getStaticProps
// only runs during buildprocess, or at a set time interval
// getStaticProps can only be called inside of the "pages" folder
// has to be called "getStaticProps"
// this is called before anything else
export async function getStaticProps() {
  const username = process.env.NEXT_PUBLIC_DB_USERNAME;
  const password = process.env.NEXT_PUBLIC_DB_PASSWORD;
  // fetch data from api or access file system, and return an object (always)
  const client = await MongoClient.connect(
    `mongodb+srv://${username}:${password}@cluster0.hsgly.mongodb.net/meetups?retryWrites=true&w=majority`
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  // the props key is what is passed to the HomePage component function
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // revalidate: 10 --not using bc not needed here, but this will update server every ten seconds
    revalidate: 1,
  };
}

// getServerSideProps
// // runs and updates for every server side request
// // only really used if req, and res are needed or if content gets updated multiple times a second
// export async function getServerSideProps(context) {
//   // get access to the request and resopnse objects
//   const req = context.req;
//   const res = context.res;
//   // fetch data from api or from file-system and return object
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }
// }

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A first meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some Address 5, 12345 SomeCity",
//     description: "This is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A second meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some Address 7, 67890 SomeCity",
//     description: "This is a second meetup!",
//   },
// ];
