import * as React from "react";
import { ChangeEvent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
// import Editor from "rich-markdown-editor";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

import {
  Button,
  Form,
  FormGroup,
  FormInput,
  Label,
  NewTopicBox,
} from "../components/StyledComponents";
import UserContext from "../contexts/UserContext";

export interface IPathParams {
  id?: string;
}

export interface NewTopicProps extends RouteComponentProps<IPathParams> {
  edit?: boolean;
}

export interface NewTopicState {
  title: string;
  body: string | null;
  status: string;
}

class NewTopic extends React.Component<NewTopicProps, NewTopicState> {
  static contextType = UserContext;

  editorRef = React.createRef<any>();

  constructor(props: NewTopicProps) {
    super(props);
    this.state = {
      title: "",
      body: null,
      status: "public",
    };
  }

  componentDidMount() {
    if (this.props.edit) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/topics/${this.props.match.params.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          this.setState({
            title: data.title,
            body: data.body,
            status: data.status,
          });
        });
    } else {
      this.setState({
        body: "",
      });
    }
  }

  handleEditorChange = (data: any) => {
    this.setState({
      body: this.editorRef.current
        .getInstance()
        .toastMark.lineTexts.join("\r\n"),
    });
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    switch (event.target.id) {
      case "title":
        this.setState({ title: event.target.value });
        break;
      case "body":
        this.setState({ body: event.target.value });
        break;
    }
  };

  handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const { title, body, status } = this.state;

    if (this.props.edit) {
      console.log("edit");
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/topics/${this.props.match.params.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title,
            body,
            status,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.context.token}`,
          },
        }
      )
        .then((res) => {
          //TODO: Check for 200 and handle errors
          return res.json();
        })
        .then((data) => {
          console.log(data);

          if (data.topic) {
            this.props.history.push(`/topic/${data.topic.id}`);
          }
        });
    } else {
      if (this.context.isAuth) {
        fetch(`${process.env.REACT_APP_SERVER_URL}/topics/`, {
          method: "POST",
          body: JSON.stringify({
            title,
            body,
            status,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.context.token}`,
          },
        })
          .then((res) => {
            //TODO: Check for 200 and handle errors
            console.log(res);
            return res.json();
          })
          .then((data) => {
            console.log(data);

            if (data.topic) {
              this.props.history.push(`/topic/${data.topic.id}`);
            }
          });
      }
    }
  };

  render() {
    return (
      <>
        {this.state.body !== null && (
          <NewTopicBox>
            <Form onSubmit={this.handleSubmit}>
              <FormInput
                id="title"
                label="Title"
                onChange={this.handleChange}
                value={this.state.title}
              />

              <FormGroup>
                <Label>Description</Label>
                <Editor
                  ref={this.editorRef}
                  initialValue={this.state.body as string}
                  onChange={this.handleEditorChange}
                />
              </FormGroup>

              <Button>{this.props.edit ? "Update" : "Create"}</Button>
            </Form>
          </NewTopicBox>
        )}
      </>
    );
  }
}

export default withRouter(NewTopic);
