import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import UserContext from "../contexts/UserContext";

export interface LoginProps {}

export interface LoginState {
  username: string;
  password: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  static contextType = UserContext;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
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
        console.log(data);
        this.context.setToken(data.token); //login
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
      <div>
        <span>You are logged {this.context.isAuth ? "in" : "out"}</span>
        <form onSubmit={this.handleSubmit}>
          <input
            id="username"
            type="text"
            placeholder="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            id="password"
            type="text"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button type="submit">
            {this.context.isAuth ? "Logout" : "Login"}
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
