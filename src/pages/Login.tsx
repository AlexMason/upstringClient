import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import {
  LoginRegisterBox as Box,
  Form,
  Label,
  Input,
  Button,
} from "../components/StyledComponents";

export interface LoginProps {}

export interface LoginState {
  username: string;
  password: string;
  error: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
  static contextType = UserContext;

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
      <Box>
        {this.context.isAuth && <Redirect to="/" />}
        {this.state.error && (
          <div className="flex justify-center text-red-500 mb-4">
            Your username or password was incorrect.
          </div>
        )}
        <Form onSubmit={this.handleSubmit}>
          {!this.context.isAuth && (
            <>
              <Label>Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <Label>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleChange}
              />{" "}
            </>
          )}
          <Button type="submit">
            {this.context.isAuth ? "Logout?" : "Login"}
          </Button>
        </Form>
        <Link to="/register">
          <Button>Register</Button>
        </Link>
      </Box>
    );
  }
}

export default Login;
