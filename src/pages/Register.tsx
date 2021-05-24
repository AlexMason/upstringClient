import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
import { Redirect } from "react-router";
import {
  LoginRegisterBox as Box,
  Form,
  Button,
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
  validated: boolean;
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
      validated: false,
      errors: [],
    };
  }

  componentDidUpdate(prevProps: RegisterProps, prevState: RegisterState) {
    if (this.state.validated) {
      if (
        prevState.firstName !== this.state.firstName ||
        prevState.lastName !== this.state.lastName ||
        prevState.username !== this.state.username ||
        prevState.email !== this.state.email ||
        prevState.password !== this.state.password ||
        prevState.passwordVerify !== this.state.passwordVerify
      ) {
        this.validateForm();
      }
    }
  }

  validateForm = (): boolean => {
    let errors = [];

    this.state.firstName.length < 1 && errors.push("firstName");
    this.state.lastName.length < 1 && errors.push("lastName");
    this.state.username.length < 6 && errors.push("username");
    !this.state.email.match(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    ) && errors.push("email");
    this.state.password.length < 8 && errors.push("password");
    this.state.password !== this.state.passwordVerify &&
      errors.push("passwordVerify");

    this.setState({
      errors,
      validated: true,
    });

    if (errors.length !== 0) return false;
    return true;
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const { username, password, email, firstName, lastName } = this.state;

    if (this.validateForm()) {
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
    }
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
        <h2
          style={{ fontFamily: "'Fira Code', monospace" }}
          className="text-3xl text-center pb-5 mb-5 border-b font-light"
        >
          {"[ register ]"}
        </h2>
        <Form>
          <FormRow>
            <FormInput
              id="firstName"
              label="First Name"
              onChange={this.handleChange}
              value={this.state.firstName}
              error={this.state.errors.includes("firstName")}
              hint={"* Required"}
            />
            <FormInput
              id="lastName"
              label="Last Name"
              onChange={this.handleChange}
              value={this.state.lastName}
              error={this.state.errors.includes("lastName")}
              hint={"* Required"}
            />
          </FormRow>
          <FormInput
            id="username"
            label="Username"
            onChange={this.handleChange}
            value={this.state.username}
            error={this.state.errors.includes("username")}
            hint={"* Must be 6 characters or longer"}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            onChange={this.handleChange}
            value={this.state.email}
            error={this.state.errors.includes("email")}
            hint={"* Must enter a valid email address"}
          />
          <FormRow>
            <FormInput
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
              error={this.state.errors.includes("password")}
              hint={"* Must be at least 8 characters long"}
            />
            <FormInput
              id="passwordVerify"
              label="Verify Password"
              type="password"
              onChange={this.handleChange}
              value={this.state.passwordVerify}
              error={this.state.errors.includes("passwordVerify")}
              hint={"* Passwords must match"}
            />
          </FormRow>
          <div className="flex justify-center p-6">
            <Button onClick={this.handleSubmit}>Submit</Button>
          </div>
        </Form>
      </Box>
    );
  }
}

export default Register;
