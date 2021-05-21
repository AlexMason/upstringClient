import * as React from "react";
import { ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";
import tw from "tailwind-styled-components";

interface ITag {
  name: string;
}

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
      recommendedTags: [],
    };
  }

  componentDidUpdate = (
    prevProps: TagsSelectorProps,
    prevState: TagsSelectorState
  ) => {
    if (prevState.selectedTags !== this.state.selectedTags) {
      this.props.onChange && this.props.onChange(this.state.selectedTags);
    }

    if (
      prevState.tagInput !== this.state.tagInput &&
      this.state.tagInput.length > 2
    ) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/tags/${this.state.tagInput}`)
        .then((res) => res.json())
        .then((tags) => {
          this.setState({
            recommendedTags: tags.map((t: ITag) => t.name),
          });
        });
    }

    if (
      prevState.tagInput !== this.state.tagInput &&
      this.state.tagInput.length < 3
    ) {
      this.setState({ recommendedTags: [] });
    }
  };

  getRecommendedTags = () => {};

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value !== ",") {
      this.setState({ tagInput: event.target.value });
    }
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

  addTag = (tag: string) => {
    this.setState({
      selectedTags: [...this.state.selectedTags, tag],
      tagInput: "",
    });
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
            <Tag className="invisible">&nbsp;</Tag>
            {this.state.selectedTags.map((tag) => {
              return (
                <Tag>
                  {tag}{" "}
                  <IoClose
                    className="text-sm"
                    onClick={() => {
                      this.deleteTag(tag);
                    }}
                  />
                </Tag>
              );
            })}
          </Tags>
          <InputWrapper>
            <TagsInput
              value={this.state.tagInput}
              onKeyDown={this.handleSubmit}
              onChange={this.handleChange}
              placeholder="Type to start adding tags, then press enter or ',' to add them."
            />
            <Suggestions
              hidden={this.state.recommendedTags.length < 1}
              style={{ minWidth: "100px" }}
            >
              {this.state.recommendedTags.map((t) => {
                return (
                  <SuggestionItem
                    onClick={() => {
                      this.addTag(t);
                    }}
                  >
                    {t}
                  </SuggestionItem>
                );
              })}
            </Suggestions>
          </InputWrapper>
        </TagsContainer>
      </>
    );
  }
}

export default TagsSelector;

const Container = tw.div`p-2 bg-white`;

const InputWrapper = tw.div`relative flex flex-grow`;
const Suggestions = tw.div`
absolute
left-0
top-10
bg-black
rounded-lg
p-2
`;
const SuggestionItem = tw.div`
py-1
border-t
cursor-pointer
`;

const TagsContainer = tw.div`
bg-black
text-white
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
pl-1.5
items-center
gap-1 border
rounded-lg
bg-white
bg-opacity-10
text-white
leading-snug
`;
const TagsInput = tw.input`
  flex-grow
  focus:outline-none
  w-full
  text-white
  bg-black
`;
