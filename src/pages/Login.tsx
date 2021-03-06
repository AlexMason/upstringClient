import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
import {
  Box,
  Button,
  Form,
  FormGroup,
  Hint,
  Input,
  Label,
} from "../components/StyledComponents";

export interface LoginProps {}

export interface LoginState {
  username: string;
  password: string;
  error: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false,
    };
  }

  handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (this.context.isAuth) {
      this.context.setToken(null); //logout
      return;
    }

    let { username, password } = this.state;

    fetch(`${process.env.REACT_APP_SERVER_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          this.context.setToken(data.token); //login
        } else {
          this.setState({ error: true });
        }
      });
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case "username":
        this.setState({ username: event.target.value });
        break;
      case "password":
        this.setState({ password: event.target.value });
        break;
    }
  };

  render() {
    return (
      <Box className="mb-36">
        {this.context.isAuth && <Redirect to="/" />}
        <h2
          style={{ fontFamily: "'Fira Code', monospace" }}
          className="text-3xl text-center pb-5 mb-5 border-b font-light"
        >
          {"[ login ]"}
        </h2>
        {this.state.error && (
          <div className="flex justify-center text-red-500 mb-4">
            Your username or password was incorrect.
          </div>
        )}
        <Form>
          {!this.context.isAuth && (
            <>
              <FormGroup>
                <Label>Username:</Label>
                <Hint>Different from your email in most cases</Hint>
                <Input
                  id="username"
                  type="text"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password:</Label>
                <Hint>Must have at least 8 characters</Hint>
                <Input
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />{" "}
              </FormGroup>
            </>
          )}
          <div className="flex flex-col justify-center mt-6 mb-4 gap-7 ">
            <Button className="w-5/12 mx-auto" onClick={this.handleSubmit}>
              {this.context.isAuth ? "Logout?" : "Login"}
            </Button>
            <hr />
            <Link to="/register">
              <RegisterLink className="w-max text-xl mx-auto underline font-normal">
                New User? Click here to register.
              </RegisterLink>
            </Link>
          </div>
        </Form>
      </Box>
    );
  }
}

export default Login;

const RegisterLink = styled.div`
  &:hover {
    color: rgba(46, 220, 255, 1);
  }
`;

// const Box = tw.div`bg-black bg-opacity-40 shadow-lg p-4 w-5/12 mx-auto`;

// const Form = tw.div`flex flex-col mx-4 my-2`;

// const FormGroup = tw.div`flex flex-col mb-3`;

// const Label = tw.label`font-medium`;
// const Hint = tw.div`text-sm pl-1.5 mb-1 text-white text-opacity-50`;

// const InputPre = styled.input`
//   color: rgba(46, 220, 255, 1);
// `;
// const Input = tw(InputPre)`
// border-none
// outline-none
// rounded-none
// bg-black
// bg-opacity-20
// ring-2
// ring-white
// ring-opacity-50
// p-1
// px-2
// mx-1.5
// `;

// const Button = tw.button`border rounded-none p-1 px-2`;
