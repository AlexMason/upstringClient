import * as React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import tw from "tailwind-styled-components";
import "./darkdown.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { RouteComponentProps, withRouter } from "react-router";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { SyntheticEvent } from "react";
import Comment from "../components/Comment";
import Loading from "../components/Loading";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Button } from "../components/StyledComponents";
import uuid from "react-uuid";
import styled from "styled-components";

export interface IPathParams {
  id: string;
}

export interface TopicProps extends RouteComponentProps<IPathParams> {}

export interface TopicState {
  topic: any;
  isTopicOwner: boolean;
  isLoading: boolean;
}

class Topic extends React.Component<TopicProps, TopicState> {
  static contextType = UserContext;
  editorRef = React.createRef<any>();

  constructor(props: TopicProps) {
    super(props);
    this.state = {
      topic: null,
      isTopicOwner: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchTopic();
  }

  fetchTopic = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/topics/${this.props.match.params.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.comments.sort((a: any, b: any) => {
          let aCommentRating = a.ratings.reduce(
            (a: number, c: any) => (a += c.positive ? 1 : -1),
            0
          );
          let bCommentRating = b.ratings.reduce(
            (b: number, c: any) => (b += c.positive ? 1 : -1),
            0
          );

          if (aCommentRating < bCommentRating) return 1;
          if (aCommentRating > bCommentRating) return -1;
          return 0;
        });

        this.setState({ topic: data, isLoading: false });

        if (this.context.isAuth && data) {
          this.setState({
            isTopicOwner: this.context.user.id === data.user.id,
          });
        }
      });
  };

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

  createComment = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/comments`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        topicId: this.state.topic.id,
        body: this.editorRef.current.getInstance().getMarkdown(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.editorRef.current.getInstance().setMarkdown("", false);

        this.fetchTopic();
      });
  };

  handleRating = (positive: boolean) => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/ratings/topic/${this.state.topic.id}`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${this.context.token}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ positive }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        this.fetchTopic();
      });
  };

  render() {
    if (!this.state.isLoading) {
      if (this.state.topic) {
        const { title, body, user, ratings, id, comments } = this.state.topic;

        const ratingsTotal = ratings.reduce(
          (a: number, c: any) => (a += c.positive ? 1 : -1),
          0
        );

        const hasRated = ratings.some((r: any) => {
          return r.userId === this.context.user.id;
        });

        const rating = ratings.some((r: any) => {
          return r.userId === this.context.user.id && r.positive;
        });

        return (
          <>
            {user && (
              <>
                <TopicContainer>
                  <TopicTitle>{title}</TopicTitle>
                  <TopicBody className="markdown-body">
                    <ReactMarkdown remarkPlugins={[gfm]} children={body} />
                  </TopicBody>
                  <TopicMeta>
                    <TopicVoting>
                      <VoteUp $active={hasRated && !rating}>
                        <FiChevronDown
                          onClick={() => {
                            this.handleRating(false);
                          }}
                        />
                      </VoteUp>
                      <VoteNum>{ratingsTotal}</VoteNum>
                      <VoteDown $active={hasRated && rating}>
                        <FiChevronUp
                          onClick={() => {
                            this.handleRating(true);
                          }}
                        />
                      </VoteDown>
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
                      posted by{" "}
                      <Author>
                        {user.firstName} ({user.username})
                      </Author>
                    </TopicControls>
                  </TopicMeta>
                </TopicContainer>

                <Comments>
                  {this.state.topic.comments.map((comment: any) => {
                    return (
                      <Comment
                        key={uuid()}
                        comment={comment}
                        id={comment.id}
                        vote={comment.rating}
                        body={comment.body}
                        author={{
                          id: comment.user.id,
                          username: comment.user.username,
                          firstName: comment.user.firstName,
                        }}
                        callback={this.fetchTopic}
                      />
                    );
                  })}
                </Comments>
                {this.context.isAuth && (
                  <CreateComment>
                    <Editor ref={this.editorRef} height="200px" />

                    <CreateCommentMeta>
                      <Button onClick={this.createComment}>Comment</Button>
                    </CreateCommentMeta>
                  </CreateComment>
                )}
              </>
            )}
          </>
        );
      } else {
        return <>404</>; //TODO: Handle 404
      }
    } else {
      return <Loading />;
    }
  }
}

export default withRouter(Topic);

const VotePre = styled.div`
  color: rgba(0, 145, 173, 1);
`;
const VoteUp = tw.div<{
  $active: boolean;
}>`cursor-pointer text-white ${(p) => (p.$active ? "" : "text-opacity-40")}`;
const VoteNum = tw(VotePre)``;
const VoteDown = tw.div<{
  $active: boolean;
}>`cursor-pointer text-white  ${(p) => (p.$active ? "" : "text-opacity-40")}`;

const Comments = tw.div`mt-6 flex flex-col gap-4 `;
const CreateComment = tw.div`mt-6 flex flex-col`;
const CreateCommentMeta = tw.div`mt-2 self-end`;

const TopicCommentsPre = styled.div`
  box-shadow: 0px 0px 10px -4px rgba(255, 255, 255, 1);
`;
const TopicContainer = tw(
  TopicCommentsPre
)`text-white bg-black bg-opacity-50 rounded-2xl`;
const TopicTitlePre = styled.div`
  font-family: "Montserrat";
  font-weight: 500;
`;
const TopicTitle = tw(TopicTitlePre)`p-4 text-2xl bg-black rounded-t-2xl`;
const TopicBody = tw.div`p-4 shadow-inner`;
const TopicMeta = tw.div`px-4 py-2 flex justify-between border-t border-gray-500 bg-black rounded-b-2xl`;
const TopicVoting = tw.div`flex items-center gap-2`;
const TopicControls = tw.div``;
const DeleteButton = tw.span`cursor-pointer`;
const Author = styled.span`
  color: rgba(0, 145, 173, 1);
  cursor: pointer;
`;
