import * as React from "react";
import { Header, Footer } from "../components";
import tw from "tailwind-styled-components";

export interface DefaultPageProps {
  centered?: boolean;
}

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

        <ContentWrapper $centered={this.props.centered}>
          {this.props.children}
        </ContentWrapper>

        <Footer />
      </PageWrapper>
    );
  }
}

export default DefaultPage;

const PageWrapper = tw.div`flex flex-col min-h-full bg-black bg-opacity-90`;

const ContentWrapper = tw.div<{ $centered?: boolean }>`
  container
  mx-auto
  flex-grow
  flex
  flex-col
  ${(p) => (p.$centered ? "justify-center" : "")}
`;
