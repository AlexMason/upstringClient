import React from "react";

interface ITagProps {}

interface ITagState {}

class Tag extends React.Component<ITagProps, ITagState> {
  constructor(props: ITagProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <>This is a happy little tag page.</>;
  }
}

export default Tag;
