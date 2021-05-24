import * as React from "react";
import tw from "tailwind-styled-components";

export interface FooterProps {}

export interface FooterState {}

class Footer extends React.Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <FooterWrapper>
          <Copyright>2021 &copy; Alexander Mason</Copyright>
        </FooterWrapper>
      </>
    );
  }
}

export default Footer;

const FooterWrapper = tw.div`
bg-black
bg-opacity-60
  text-gray-100
  py-4
  mt-12
  shadow-2xl
`;

const Copyright = tw.div`
  flex
  justify-center
`;
