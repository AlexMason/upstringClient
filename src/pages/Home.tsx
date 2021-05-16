import * as React from "react";
import tw from "tailwind-styled-components";
import { Button } from "../components/StyledComponents";
import { FiChevronDown, FiChevronUp, FiTag } from "react-icons/fi";
import uuid from "react-uuid";
import { Link } from "react-router-dom";

export interface HomeProps {}

export interface HomeState {
  topics: any[];
}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      topics: [],
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/topics`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        this.setState({
          topics: data,
        });
      });
  }

  render() {
    return (
      <>
        <UtilityBar>
          <div></div>
          <div>
            <Link to="/topic/new">
              <Button>New Topic</Button>
            </Link>
          </div>
        </UtilityBar>
        <TopicsContainer>
          {this.state.topics.map((topic) => {
            return (
              <Topic
                key={uuid()}
                id={topic.id}
                title={topic.title}
                tags={[]}
                comments={0}
                answers={0}
                vote={topic.rating}
                author={{
                  id: topic.user.id,
                  firstName: topic.user.firstName,
                  username: topic.user.username,
                }}
              />
            );
          })}
          <Topic
            id={0}
            title="This is a Topic title"
            tags={["HTML", "CSS", "JavaScript"]}
            comments={0}
            answers={0}
            vote={0}
            author={{
              id: 1,
              firstName: "Alex",
              username: "alexmason93",
            }}
          />
        </TopicsContainer>
      </>
    );
  }
}

export default Home;

const UtilityBar = tw.div`
  flex
  justify-between
`;

const TopicsContainer = tw.div`flex flex-col gap-4 mt-4`;
const TopicItem = tw.div`border p-2 flex flex-row gap-2`;
const TopicVoting = tw.div`flex flex-col items-center px-4`;
const TopicContent = tw.div`flex-grow`;
const TopicTitle = tw.div`text-lg`;
const TopicMeta = tw.div`flex justify-between text-sm`;
const TopicTags = tw.div``;
const TopicTagItem = tw.div`inline-block`;

interface IAuther {
  id: number;
  firstName: string;
  username: string;
}

type TopicItemProps = {
  id: number;
  tags?: string[];
  comments: number;
  answers: number;
  author: IAuther;
  title: string;
  vote: number;
};

const Topic = (props: TopicItemProps) => {
  return (
    <TopicItem>
      <TopicVoting>
        <FiChevronUp />
        <span>{props.vote}</span>
        <FiChevronDown />
      </TopicVoting>
      <TopicContent>
        <Link
          className="h-full flex flex-col justify-between"
          to={`/topic/${props.id}`}
        >
          <TopicTitle>{props.title}</TopicTitle>
          <TopicMeta>
            <TopicTags>
              {props.tags &&
                props.tags.length > 0 &&
                props.tags
                  ?.map<React.ReactNode>((tag: string) => {
                    return (
                      <TopicTagItem key={uuid()}>
                        <Link to="/tag/" key={uuid()}>
                          <FiTag className="inline-block" /> {tag}
                        </Link>
                      </TopicTagItem>
                    );
                  })
                  .reduce((prev, curr) => [prev, ", ", curr])}
            </TopicTags>
            <div>
              {props.comments} comment{props.comments === 1 ? "" : "s"} |{" "}
              {props.answers} answer{props.answers === 1 ? "" : "s"} | by{" "}
              {props.author.firstName} ({props.author.username})
            </div>
          </TopicMeta>
        </Link>
      </TopicContent>
    </TopicItem>
  );
};
