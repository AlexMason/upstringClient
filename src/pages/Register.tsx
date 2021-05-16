import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import { ChangeEventHandler } from "react";
import { Redirect } from "react-router";
import {
  LoginRegisterBox as Box,
  Form,
  Label,
  Input,
  Button,
  FormGroup,
  FormRow,
  FormInput,
} from "../components/StyledComponents";
import UserContext from "../contexts/UserContext";

export interface RegisterProps {}

export interface RegisterState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  passwordVerify: string;
  registered: boolean;
  errors: Array<string>;
}

class Register extends React.Component<RegisterProps, RegisterState> {
  static contextType = UserContext;

  constructor(props: RegisterProps) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      passwordVerify: "",
      registered: false,
      errors: [],
    };
  }

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { username, password, email, firstName, lastName } = this.state;

    fetch(`${process.env.REACT_APP_SERVER_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        email,
        firstName,
        lastName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.token) {
          this.context.setToken(data.token); //login
          //TODO: Handle redirect to home page
        } else {
          //TODO: Handle failed register
          this.setState({
            errors: ["Ugh something messed up."],
          });
        }
      });
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    switch (event.target.id) {
      case "firstName":
        this.setState({ firstName: event.target.value });
        break;
      case "lastName":
        this.setState({ lastName: event.target.value });
        break;
      case "username":
        this.setState({ username: event.target.value });
        break;
      case "email":
        this.setState({ email: event.target.value });
        break;
      case "password":
        this.setState({ password: event.target.value });
        break;
      case "passwordVerify":
        this.setState({ passwordVerify: event.target.value });
        break;
    }
  };

  render() {
    return (
      <Box>
        {this.context.isAuth && <Redirect to="/" />}
        {this.state.errors.length > 0 && (
          <div className="flex justify-center text-red-500 mb-4">
            {this.state.errors[0]}
          </div>
        )}
        <Form onSubmit={this.handleSubmit}>
          <FormRow>
            <FormInput
              id="firstName"
              label="First Name"
              onChange={this.handleChange}
              value={this.state.firstName}
            />
            <FormInput
              id="lastName"
              label="Last Name"
              onChange={this.handleChange}
              value={this.state.lastName}
            />
          </FormRow>
          <FormInput
            id="username"
            label="Username"
            onChange={this.handleChange}
            value={this.state.username}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <FormRow>
            <FormInput
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            <FormInput
              id="passwordVerify"
              label="Verify Password"
              type="password"
              onChange={this.handleChange}
              value={this.state.passwordVerify}
            />
          </FormRow>
          <Button type="submit">Register</Button>
        </Form>
      </Box>
    );
  }
}

export default Register;
