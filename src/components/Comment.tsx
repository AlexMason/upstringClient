import * as React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
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

interface IAuthor {
  id: number;
  username: string;
  firstName: string;
}

interface IComment {
  ratings: any[];
}

export interface CommentProps {
  id: number;
  author: IAuthor;
  body: string;
  vote: number;
  comment: IComment;
  callback: CallableFunction;
}

export interface CommentState {
  isCommentOwner: boolean;
  isEditing: boolean;
  voteTotal: number;
  validated: false;
  error: string;
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.props.callback();
        this.toggleEdit();
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
    let voteTotal = this.props.comment.ratings.reduce((a, c) => {
      a += c.positive ? 1 : -1;
      return a;
    }, 0);

    let voted = false;
    let votedPositive = false;

    if (this.context.isAuth) {
      voted =
        this.props.comment.ratings.filter((r) => {
          if (r.userId === this.context.user.id) return true;
          return false;
        }).length > 0;
      votedPositive =
        this.props.comment.ratings.filter((r) => {
          if (r.userId === this.context.user.id && r.positive) return true;
          return false;
        }).length > 0;
    }

    return (
      <Container>
        <VoteMeta>
          <FiChevronUp
            style={{ cursor: "pointer" }}
            onClick={(e) => this.changeRating(e, true)}
          />
          <VoteCount $voted={voted} $positive={votedPositive}>
            {voteTotal}
          </VoteCount>
          <FiChevronDown
            style={{ cursor: "pointer" }}
            onClick={(e) => this.changeRating(e, false)}
          />
        </VoteMeta>
        <Content>
          <Body className="markdown-body">
            {this.state.isEditing ? (
              <>
                <Editor
                  height="200px"
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
            {this.state.isEditing ? (
              <>
                <EditControl onClick={this.toggleEdit}>Cancel</EditControl>
                <SaveControl onClick={this.updateComment}>Save</SaveControl>
              </>
            ) : (
              <>
                {this.state.isCommentOwner && (
                  <EditControl onClick={this.toggleEdit}>Edit</EditControl>
                )}
                {this.state.isCommentOwner && (
                  <DeleteControl onClick={this.deleteComment}>
                    Delete
                  </DeleteControl>
                )}
                {this.context.isAuth && <ReplyControl>Reply</ReplyControl>} by{" "}
                {this.props.author.firstName} ({this.props.author.username})
              </>
            )}
          </Controls>
        </Content>
      </Container>
    );
  }
}

export default Comment;

const Container = tw.div`flex bg-gray-200 text-black`;
const VoteMeta = tw.div`flex flex-col items-center px-4 py-2 bg-gray-300 text-xl`;
const VoteCount = tw.span<{ $voted: boolean; $positive: boolean }>`
  ${(p) =>
    p.$voted ? (!p.$positive ? "text-yellow-600" : "text-blue-700") : ""}
`;
const Body = tw.div`p-4 border-b border-gray-300`;
const Controls = tw.div`self-end text-sm pr-2 py-1`;
const Content = tw.div`flex-grow flex flex-col justify-between`;

const ControlBase = styled.span`
  cursor: pointer;

  &::after {
    color: black;
    content: " | ";
    cursor: default;
  }
`;

const EditControl = tw(ControlBase)``;
const DeleteControl = tw(ControlBase)`
text-red-500
`;
const ReplyControl = tw(ControlBase)``;
const SaveControl = tw.span`cursor-pointer`;
