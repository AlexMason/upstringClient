import * as React from "react";
import tw from "tailwind-styled-components";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";

export interface HeaderProps {}

export interface HeaderState {}

class Header extends React.Component<HeaderProps, HeaderState> {
  static contextType = UserContext;

  constructor(props: HeaderProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <HeaderWrapper>
        <Nav>
          <Link to="/">
            <NavBrand>
              <img src="./brand.png" />
            </NavBrand>
          </Link>
          <NavMenuItems>
            <Link to={`/`}>
              <MenuItem>Home</MenuItem>
            </Link>
            {this.context.isAuth && (
              <Link to={`/profile`}>
                <MenuItem>Profile</MenuItem>
              </Link>
            )}
            {this.context.isAuth ? (
              <MenuItem onClick={() => this.context.setToken(null)}>
                Log Out
              </MenuItem>
            ) : (
              <Link to={`/login`}>
                <MenuItem>Log In</MenuItem>
              </Link>
            )}
          </NavMenuItems>
        </Nav>
      </HeaderWrapper>
    );
  }
}

export default Header;

const HeaderWrapper = tw.div`
  bg-black
  bg-opacity-60
  py-4
  text-gray-100
  shadow-xl
  mb-12
`;

const Nav = tw.div`container mx-auto flex justify-between items-center`;

const NavBrand = tw.div`w-72`;

const NavMenuItems = tw.div`flex`;

const MenuItemPre = styled.div`
  background-color: rgba(0, 145, 173, var(--tw-bg-opacity));
  font-family: "Roboto", sans-serif;
`;

const MenuItem = tw(MenuItemPre)`
  mx-2
  px-3 
  py-1 
  border
  bg-opacity-100
  border-gray-800
  filter
  hover:border-opacity-50
  hover:border-gray-300
  cursor-pointer
  text-black
  text-lg
  font-normal
`;
