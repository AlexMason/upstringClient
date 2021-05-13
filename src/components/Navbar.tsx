import * as React from "react";

export interface NavbarProps {}

export interface NavbarState {}

class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Navbar</div>;
  }
}

export default Navbar;
