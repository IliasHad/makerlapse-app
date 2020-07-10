import React from "react";
import { Layout } from "../Components/layout";
import { Content } from "../Components/content";
import { Header } from "../Components/header";

export const IndexPage = () => {
  return (
    <Layout>
      <Header title="Makerlapse" returnPath="/preferences" />

      <Content />
    </Layout>
  );
};
