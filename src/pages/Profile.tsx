import * as React from "react";
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import UserContext from "../contexts/UserContext";
import { IComment, ITopic, IUser } from "../interfaces";
import uuid from "react-uuid";

export interface ProfileProps extends RouteComponentProps {}

export interface ProfileState {
  selectedMenu: string;
  comments: IComment[];
  topics: ITopic[];
  user?: IUser;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  static contextType = UserContext;

  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      selectedMenu: "",
      topics: [],
      comments: [],
      user: undefined,
    };
  }

  componentDidMount() {
    this.loadProfile();
  }

  componentDidUpdate(prevProps: ProfileProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.loadProfile();
    }
  }

  loadProfile = () => {
    let id = parseInt(this.props.location.pathname.split("/")[2]);

    if (id) {
      this.fetchUser(id);
      this.fetchTopics(id);
      this.fetchComments(id);
    }
  };

  fetchUser = (userId: number) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`, {})
      .then((res) => res.json())
      .then((data: any) => {
        this.setState({
          user: data.user,
        });
      });
  };

  //fetch topics
  fetchTopics = (userId: number) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/topics/${userId}`, {
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
      }),
    })
      .then((res) => res.json())
      .then((data: ITopic[]) => {
        this.setState({
          topics: data,
        });
      });
  };

  //fetch comments
  fetchComments = (userId: number) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/comments/${userId}`, {
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
      }),
    })
      .then((res) => res.json())
      .then((data: IComment[]) => {
        this.setState({
          comments: data,
        });
      });
  };

  render() {
    return (
      <>
        <ProfileTitle>
          /profile/{this.state.user && this.state.user.username}
        </ProfileTitle>
        <ProfileMenu menuItems={["topics", "comments"]} />

        <Switch>
          <Route path="/profile/:id/topics">
            <div>
              {this.state.topics.map((topic) => {
                return (
                  <Link key={topic.id} to={`/topic/${topic.id}`}>
                    <ContentLink>{topic.title}</ContentLink>
                  </Link>
                );
              })}
            </div>
          </Route>
          <Route path="/profile/:id/comments">
            <div>
              {this.state.comments.map((comment) => {
                return (
                  <Link key={comment.id} to={`/topic/${comment.topicId}`}>
                    <ContentLink>{comment.body}</ContentLink>
                  </Link>
                );
              })}
            </div>
          </Route>
          <Route path="/profile/:id" exact>
            {
              <Redirect
                to={`/profile/${
                  this.props.location.pathname.split("/")[2]
                }/topics`}
              />
            }
          </Route>
          <Route path="/profile/" exact>
            {<Redirect to={`/profile/${this.context.user.id}/topics`} />}
          </Route>
        </Switch>
      </>
    );
  }
}

export default withRouter(Profile);

const ProfileTitlePre = styled.h1`
  font-family: "Fire Code", monospace;
`;
const ProfileTitle = tw(ProfileTitlePre)`
  text-4xl mb-6
`;
const ContentLink = tw.div`border mb-3 p-2 rounded-lg bg-black bg-opacity-30 text-white text-opacity-75`;

/////////////////////////////////////////////////////////////////////

interface ProfileMenuProps extends RouteComponentProps {
  menuItems: string[];
}

interface ProfileMenuState {
  selectedMenu: string;
}

class ProfileMenuClass extends React.Component<
  ProfileMenuProps,
  ProfileMenuState
> {
  constructor(props: ProfileMenuProps) {
    super(props);

    this.state = {
      selectedMenu:
        this.props.location.pathname.split("/")[3] || props.menuItems[0] || "",
    };
  }

  render() {
    return (
      <PMBar>
        {this.props.menuItems.map((item) => (
          <PMBarItem
            key={uuid()}
            onClick={() => {
              this.setState({ selectedMenu: item });
              this.props.history.push(
                `/profile/${this.props.location.pathname.split("/")[2]}/${item}`
              );
            }}
            $active={this.state.selectedMenu === item}
          >
            {item}
          </PMBarItem>
        ))}
      </PMBar>
    );
  }
}

const ProfileMenu = withRouter(ProfileMenuClass);

const PMBar = tw.div`
  flex
  gap-6
  mb-3
  border-b-2
  pl-4
`;

const PMBarItem = tw.div<{
  $active: boolean;
}>`uppercase cursor-pointer font-medium ${(p) =>
  p.$active ? "border-b-2" : ""}`;

/////////////////////////////////////////////////////////////////////
