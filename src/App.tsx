import "./App.css";
import tw from "tailwind-styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Topic,
  EditTopic,
  Login,
  Register,
  Profile,
  Home,
  DefaultPage as Page,
} from "./pages";

import styled from "styled-components";
import React from "react";
import Tag from "./pages/Tag";

function App() {
  return (
    <Router>
      <AppWrapper>
        <Switch>
          <PageRoute centered path="/login" component={<Login />} />
          <PageRoute centered path="/register" component={<Register />} />
          <PageRoute path="/profile" component={<Profile />} />
          <PageRoute centered path="/topic/new" component={<EditTopic />} />
          <PageRoute path="/topic/edit/:id" component={<EditTopic edit />} />
          <PageRoute path="/topic/:id" component={<Topic />} />
          <PageRoute path="/tag" component={<Tag />} />
          <PageRoute path="/" component={<Home />} />
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;

type PageRouteProps = {
  path: string;
  component: any;
  centered?: boolean;
};

const PageRoute: React.FC<PageRouteProps> = ({ path, centered, component }) => (
  <Route path={path}>
    <Page centered={centered}>{component}</Page>
  </Route>
);

const AppWrapperPre = styled.div`
  font-family: "Roboto", sans-serif;
`;

const AppWrapper = tw(AppWrapperPre)`
  h-full
  text-gray-50
`;
