import * as React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import tw from "tailwind-styled-components";
import "./markdown.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { RouteComponentProps, withRouter } from "react-router";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { SyntheticEvent } from "react";

export interface IPathParams {
  id: string;
}

export interface TopicProps extends RouteComponentProps<IPathParams> {}

export interface TopicState {
  topic: any;
  isTopicOwner: boolean;
}

class Topic extends React.Component<TopicProps, TopicState> {
  static contextType = UserContext;

  constructor(props: TopicProps) {
    super(props);
    this.state = {
      topic: null,
      isTopicOwner: false,
    };
  }

  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/topics/${this.props.match.params.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({ topic: data });

        if (this.context.isAuth && data) {
          this.setState({
            isTopicOwner: this.context.user.id === data.user.id,
          });
        }
      });
  }

  handleDelete = (event: SyntheticEvent) => {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/topics/${this.state.topic.id}`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
      }),
    }).then((res) => {
      if (res.status === 200) {
        this.props.history.push("/");
      }
    });
  };

  render() {
    if (this.state.topic) {
      const { title, body, user, rating, id, comments } = this.state.topic;

      return (
        <>
          {user && (
            <TopicContainer>
              <TopicTitle>{title}</TopicTitle>
              <TopicBody className="markdown-body">
                <ReactMarkdown remarkPlugins={[gfm]} children={body} />
              </TopicBody>
              <TopicMeta>
                <TopicVoting>
                  <FiChevronDown />
                  <span>{rating}</span>
                  <FiChevronUp />
                </TopicVoting>
                <TopicControls>
                  {this.state.isTopicOwner && (
                    <>
                      <Link to={`/topic/edit/${id}`}>Edit</Link> |{" "}
                    </>
                  )}
                  {this.state.isTopicOwner && (
                    <>
                      <DeleteButton onClick={this.handleDelete}>
                        Delete
                      </DeleteButton>{" "}
                      |{" "}
                    </>
                  )}
                  posted by {user.firstName} ({user.username})
                </TopicControls>
              </TopicMeta>
            </TopicContainer>
          )}
        </>
      );
    } else {
      return <>404</>;
    }
  }
}

export default withRouter(Topic);

const TopicContainer = tw.div`text-gray-800 bg-gray-200`;
const TopicTitle = tw.div`p-4 text-2xl bg-gray-400 border-b border-gray-300`;
const TopicBody = tw.div`p-4 shadow-inner`;
const TopicMeta = tw.div`px-4 py-2 flex justify-between border-t border-gray-500`;
const TopicVoting = tw.div`flex items-center gap-2`;
const TopicControls = tw.div``;
const DeleteButton = tw.span`cursor-pointer`;
