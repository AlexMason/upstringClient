import * as React from "react";
import { ChangeEvent } from "react";
import { FiXSquare } from "react-icons/fi";
import tw from "tailwind-styled-components";

export interface TagsSelectorProps {
  onChange?: CallableFunction;
  selectedTags?: string[];
}

export interface TagsSelectorState {
  tagInput: string;
  selectedTags: string[];
  recommendedTags: string[];
}

class TagsSelector extends React.Component<
  TagsSelectorProps,
  TagsSelectorState
> {
  constructor(props: TagsSelectorProps) {
    super(props);
    this.state = {
      tagInput: "",
      selectedTags: this.props.selectedTags || [],
      recommendedTags: ["TypeScript", "React", "NodeJS"],
    };
  }

  componentDidUpdate = (
    prevProps: TagsSelectorProps,
    prevState: TagsSelectorState
  ) => {
    if (prevState.selectedTags !== this.state.selectedTags) {
      this.props.onChange && this.props.onChange(this.state.selectedTags);
    }
  };

  getRecommendedTags = () => {};

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    this.setState({ tagInput: event.target.value });
  };

  handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    let formattedInput = this.state.tagInput
      .toLowerCase()
      .replaceAll(/[^a-z0-9.]/g, "");
    //Enter, Comma
    if (
      (event.which === 13 || event.which === 188) &&
      this.state.tagInput.length > 2
    ) {
      if (!this.state.selectedTags.includes(formattedInput)) {
        this.setState({
          selectedTags: [...this.state.selectedTags, formattedInput],
          tagInput: "",
        });
      } else {
        this.setState({
          tagInput: "",
        });
      }
    }

    //Backspace
    if (event.which === 8 && this.state.tagInput.length === 0) {
      this.setState({
        selectedTags: this.state.selectedTags.slice(
          0,
          this.state.selectedTags.length - 1
        ),
      });
    }
  };

  deleteTag = (deletedTag: string) => {
    this.setState({
      selectedTags: this.state.selectedTags.filter((tag) => {
        if (tag.toLocaleLowerCase() === deletedTag.toLocaleLowerCase()) {
          return false;
        }
        return true;
      }),
    });
  };

  render() {
    return (
      <>
        <TagsContainer>
          <Tags>
            {this.state.selectedTags.map((tag) => {
              return (
                <Tag>
                  {tag}{" "}
                  <FiXSquare
                    onClick={() => {
                      this.deleteTag(tag);
                    }}
                  />
                </Tag>
              );
            })}
          </Tags>
          <TagsInput
            value={this.state.tagInput}
            onKeyDown={this.handleSubmit}
            onChange={this.handleChange}
            placeholder="Type to start adding tags, then press enter or ',' to add them."
          />
        </TagsContainer>
      </>
    );
  }
}

export default TagsSelector;

const Container = tw.div`p-2 bg-white`;

const TagsContainer = tw.div`
bg-white
text-black
text-sm
border-2
border-gray-300
rounded-none
flex
p-1
gap-2
focus-within:border-gray-900
focus-within:ring-1
focus-within:ring-white
`;
const Tags = tw.div`
flex
gap-2
`;
const Tag = tw.div`
flex
p-1
items-center
gap-1 border
rounded
bg-gray-200
text-gray-700
`;
const TagsInput = tw.input`
  flex-grow
  focus:outline-none
`;
