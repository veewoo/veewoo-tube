import { ReactElement } from "react";
import Layout from "src/components/Layout";
import VideoList from "src/components/List/VideoList";
import { NextPageWithLayout } from "src/types/core";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <VideoList />
    </>
  );
};

Home.getLayout = (page: ReactElement) => <Layout hasHeader>{page}</Layout>;
export default Home;
