import * as React from "react";

export interface TopicProps {}

export interface TopicState {}

class Topic extends React.Component<TopicProps, TopicState> {
  constructor(props: TopicProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <>This is the topic page</>;
  }
}

export default Topic;
