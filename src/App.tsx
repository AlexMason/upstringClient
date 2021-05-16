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

function App() {
  return (
    <Router>
      <AppWrapper>
        <Page>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/topic/new">
              <EditTopic />
            </Route>
            <Route path="/topic/edit/:id">
              <EditTopic edit />
            </Route>
            <Route path="/topic/:id">
              <Topic />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Page>
      </AppWrapper>
    </Router>
  );
}

export default App;

const AppWrapper = tw.div`
  h-full
  bg-gray-900
  text-gray-50
`;
