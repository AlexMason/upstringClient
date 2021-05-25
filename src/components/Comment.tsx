import * as React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import UserContext from "../contexts/UserContext";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { SyntheticEvent } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { ValidationMsg } from "./StyledComponents";
import { IComment } from "../interfaces";
import { Link } from "react-router-dom";

interface IAuthor {
  id: number;
  username: string;
  firstName: string;
}

export interface CommentProps {
  id: number;
  author: IAuthor;
  body: string;
  vote: number;
  comment: IComment;
  callback: CallableFunction;
  replyCb: CallableFunction;
}

export interface CommentState {
  isCommentOwner: boolean;
  isEditing: boolean;
  voteTotal: number;
  validated: false;
  error: string;
  stickied: string;
}

class Comment extends React.Component<CommentProps, CommentState> {
  static contextType = UserContext;
  editorRef = React.createRef<any>();

  constructor(props: CommentProps) {
    super(props);

    this.state = {
      isCommentOwner: false,
      isEditing: false,
      voteTotal: 0,
      validated: false,
      error: "",
      stickied: this.props.comment.stickied,
    };
  }

  componentDidMount() {
    if (
      this.context.isAuth &&
      this.state.isCommentOwner !==
        (this.context.user.id === this.props.author.id)
    ) {
      this.setState({
        isCommentOwner: this.context.user.id === this.props.author.id,
      });
    }
  }

  componentDidUpdate() {
    if (
      this.context.isAuth &&
      this.state.isCommentOwner !==
        (this.context.user.id === this.props.author.id)
    ) {
      this.setState({
        isCommentOwner: this.context.user.id === this.props.author.id,
      });
    }
  }

  toggleEdit = () => {
    this.setState({
      isEditing: !this.state.isEditing,
      error: "",
      validated: false,
    });
  };

  validateForm = (): boolean => {
    let error = "";

    if (this.editorRef.current.getInstance().getMarkdown().length < 10)
      error = "Please enter 10 characters or more.";

    this.setState({ error });
    if (error === "") return true;
    return false;
  };

  updateComment = () => {
    if (!this.validateForm()) {
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/comments/${this.props.id}`, {
      method: "PUT",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        body: this.editorRef.current.getInstance().getMarkdown(),
        stickied: this.state.stickied,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.props.callback();
        this.toggleEdit();
      });
  };

  toggleStickied = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/comments/${this.props.id}`, {
      method: "PUT",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        body: this.props.comment.body,
        stickied: this.state.stickied === "moderator" ? "none" : "moderator",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.props.callback();
      });
  };

  deleteComment = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/comments/${this.props.id}`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.props.callback();
      });
  };

  changeRating = (event: SyntheticEvent, positive: boolean) => {
    console.log(positive);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/ratings/comment/${this.props.id}`,
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
        this.props.callback();
      });
  };

  render() {
    let voteTotal = this.props.comment.ratings!.reduce((a, c) => {
      a += c.positive ? 1 : -1;
      return a;
    }, 0);

    let voted = false;
    let votedPositive = false;

    if (this.context.isAuth) {
      voted =
        this.props.comment.ratings!.filter((r) => {
          if (r.userId === this.context.user.id) return true;
          return false;
        }).length > 0;
      votedPositive =
        this.props.comment.ratings!.filter((r) => {
          if (r.userId === this.context.user.id && r.positive) return true;
          return false;
        }).length > 0;
    }

    return (
      <Container stickied={this.state.stickied === "moderator"}>
        <VoteMeta>
          <VoteUp $active={voted && votedPositive}>
            <FiChevronUp onClick={(e) => this.changeRating(e, true)} />
          </VoteUp>
          <VoteNum>{voteTotal}</VoteNum>
          <VoteDown $active={voted && !votedPositive}>
            <FiChevronDown onClick={(e) => this.changeRating(e, false)} />
          </VoteDown>
        </VoteMeta>
        <Content>
          <Body className="markdown-body">
            {this.state.isEditing ? (
              <>
                <Editor
                  height="100px"
                  initialValue={this.props.body}
                  ref={this.editorRef}
                />
                <ValidationMsg>{this.state.error}</ValidationMsg>
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[gfm]} children={this.props.body} />
            )}
          </Body>
          <Controls>
            <div className="text-xs self-center pl-1 text-cyan-900 flex gap-1 items-center">
              {this.state.stickied === "moderator" && <FaThumbtack />}
              {this.context.user.role >= 2 && (
                <div
                  className="text-white text-xs cursor-pointer font-light uppercase pl-1"
                  onClick={this.toggleStickied}
                >
                  {this.state.stickied === "moderator"
                    ? "pinned"
                    : "pin comment"}
                </div>
              )}
            </div>
            <div className="float-right">
              {this.state.isEditing ? (
                <>
                  <EditControl onClick={this.toggleEdit}>Cancel</EditControl>
                  <SaveControl onClick={this.updateComment}>Save</SaveControl>
                </>
              ) : (
                <>
                  {(this.state.isCommentOwner ||
                    this.context.user.role === 2) && (
                    <EditControl onClick={this.toggleEdit}>Edit</EditControl>
                  )}
                  {(this.state.isCommentOwner ||
                    this.context.user.role === 2) && (
                    <DeleteControl onClick={this.deleteComment}>
                      Delete
                    </DeleteControl>
                  )}
                  {this.context.isAuth && (
                    <ReplyControl
                      onClick={() => {
                        this.props.replyCb(
                          this.props.body,
                          this.props.author.username
                        );
                      }}
                    >
                      Reply
                    </ReplyControl>
                  )}
                  by{" "}
                  <Link to={`/profile/${this.props.author.id}`}>
                    <Author>
                      {this.props.author.firstName} (
                      {this.props.author.username})
                    </Author>
                  </Link>
                </>
              )}
            </div>
          </Controls>
        </Content>
      </Container>
    );
  }
}

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

export default Comment;

const ContainerPre = styled.div<{ stickied: boolean }>`
  ${(p) =>
    p.stickied
      ? "box-shadow: 0px 0px 10px -2px rgba(0, 145, 173, 1);"
      : "box-shadow: 0px 0px 10px -5px rgba(255, 255, 255, 0);"}
`;
const Container = tw(
  ContainerPre
)`flex bg-black bg-opacity-50 text-white rounded-2xl`;
const VoteMeta = tw.div`flex flex-col items-center px-4 py-2 bg-black text-xl border-r-2 border-white border-opacity-10 rounded-l-2xl asdasdasd`;

const Body = tw.div`p-4`;
const Controls = tw.div`flex justify-between text-sm pr-2 py-1 bg-black rounded-br-2xl`;
const Content = tw.div`flex-grow flex flex-col justify-between`;

const ControlBase = styled.span`
  cursor: pointer;

  &::after {
    color: white;
    content: " | ";
    cursor: default;
  }
`;

const EditControl = tw(ControlBase)`hover:text-cyan-600`;
const DeleteControl = tw(ControlBase)`
hover:text-red-500
`;
const ReplyControl = tw(ControlBase)``;
const SaveControl = tw.span`cursor-pointer`;
const Author = styled.span`
  color: rgba(0, 145, 173, 1);
  cursor: pointer;
`;
