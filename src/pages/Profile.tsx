import * as React from "react";

export interface ProfileProps {}

export interface ProfileState {}

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <>This is the profile page</>;
  }
}

export default Profile;
