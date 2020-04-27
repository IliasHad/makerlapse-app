import React from "react";
import { Layout } from "../Components/layout";
import { Header } from "../Components/header";
import { Link } from "react-router-dom";

export const PreferencesPage = () => {
  return (
    <Layout>
      <Header title="Settings" />

      <button className="button button-primary">Save</button>
      <Link to="/">
      <button className="button button-secondary">Cancel</button>

      </Link>
    </Layout>
  );
};
