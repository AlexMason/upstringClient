import * as React from "react";
import { Header, Footer } from "../components";
import tw from "tailwind-styled-components";

export interface DefaultPageProps {}

export interface DefaultPageState {}

class DefaultPage extends React.Component<DefaultPageProps, DefaultPageState> {
  constructor(props: DefaultPageProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageWrapper>
        <Header />

        <ContentWrapper>{this.props.children}</ContentWrapper>

        <Footer />
      </PageWrapper>
    );
  }
}

export default DefaultPage;

const PageWrapper = tw.div``;

const ContentWrapper = tw.div`
  container
  mx-auto
`;
