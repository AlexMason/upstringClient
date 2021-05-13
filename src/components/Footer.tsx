import * as React from "react";
import styled from "styled-components";
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
        <ArtificalSpace />
        <FooterWrapper>
          <Copyright>2021 &copy; Alexander Mason</Copyright>
        </FooterWrapper>
      </>
    );
  }
}

export default Footer;

const FooterWrapper = tw.div`
  bg-gray-800
  text-gray-100
  py-4
  mt-12
  shadow-lg
`;

const ArtificalSpace = styled.div`
  height: 300px;
`;

const Copyright = tw.div`
  flex
  justify-center
`;