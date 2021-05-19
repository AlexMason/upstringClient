import * as React from "react";
import tw from "tailwind-styled-components";
import { ImSpinner2 } from "react-icons/im";

export interface LoadingProps {}

export interface LoadingState {}

class Loading extends React.Component<LoadingProps, LoadingState> {
  constructor(props: LoadingProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Container className="">
        <ImSpinner2 className="h-full text-9xl animate-spin" />
      </Container>
    );
  }
}

export default Loading;

const Container = tw.div`self-center justify-self-center`;
