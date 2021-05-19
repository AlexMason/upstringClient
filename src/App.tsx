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

import Tags from "./components/TagsSelector";

function App() {
  return (
    <Router>
      <AppWrapper>
        <Page>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/topic/new" component={EditTopic} />
            <Route path="/topic/edit/:id">
              <EditTopic edit />
            </Route>
            <Route path="/topic/:id" component={Topic} />
            <Route path="/tags" component={Tags} />
            <Route path="/" component={Home} />
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
