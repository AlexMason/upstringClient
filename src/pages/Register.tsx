import * as React from "react";

export interface RegisterProps {}

export interface RegisterState {}

class Register extends React.Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>This is the register page.</div>;
  }
}

export default Register;
