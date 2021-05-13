import * as React from "react";
import tw from "tailwind-styled-components";
import { Link } from "react-router-dom";

export interface HeaderProps {}

export interface HeaderState {}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <HeaderWrapper>
        <Nav>
          <NavBrand>Header</NavBrand>
          <NavMenuItems>
            <Link to={`/`}>
              <MenuItem>Home</MenuItem>
            </Link>
            <Link to={`/profile`}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <Link to={`/login`}>
              <MenuItem>Log In</MenuItem>
            </Link>
          </NavMenuItems>
        </Nav>
      </HeaderWrapper>
    );
  }
}

export default Header;

const HeaderWrapper = tw.div`
  bg-gray-800
  py-4
  text-gray-100
  shadow-xl
  mb-12
`;

const Nav = tw.div`container mx-auto flex justify-between items-center`;

const NavBrand = tw.div``;

const NavMenuItems = tw.div`flex`;

const MenuItem = tw.div`
  mx-2
  px-3 
  py-1 
  border
  bg-gray-900
  border-gray-800

  hover:border-gray-300
  cursor-pointer
`;
