import * as React from "react";
import tw from "tailwind-styled-components";
import { FiChevronDown, FiChevronUp, FiTag } from "react-icons/fi";
import uuid from "react-uuid";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";

export interface ITopicsData {
  id: number;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: any;
  tags?: any[];
  ratings?: any[];
}

export interface HomeProps {
  history?: any;
}

export interface HomeState {
  topics: Array<any>;
}

class Home extends React.Component<HomeProps, HomeState> {
  static contextType = UserContext;

  constructor(props: HomeProps) {
    super(props);
    this.state = {
      topics: [],
    };
  }

  componentDidMount() {
    this.fetchTopics();
  }

  fetchTopics = () => {
    console.log("REACT APP ENV: ", process.env.REACT_APP_SERVER_URL);
    fetch(`${process.env.REACT_APP_SERVER_URL}/topics`)
      .then((res) => res.json())
      .then((data: ITopicsData[]) => {
        console.log(data);

        this.setState({
          topics: data,
        });
      });
  };

  changeRating = (topic: number, positive: boolean) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/ratings/topic/${topic}`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ positive }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.fetchTopics();
      });
  };

  render() {
    return (
      <>
        <UtilityBar>
          <div></div>
          <div>
            {this.context.isAuth && (
              <Link to="/topic/new">
                <Button>New Topic</Button>
              </Link>
            )}
          </div>
        </UtilityBar>
        <TopicsContainer>
          {this.state.topics.map((topic: any) => {
            const ratingsTotal = topic.ratings.reduce(
              (a: number, c: any) => (a += c.positive ? 1 : -1),
              0
            );
            return (
              <Topic
                key={uuid()}
                id={topic.id}
                title={topic.title}
                tags={topic.tags.map((tag: any) => tag.name)}
                comments={topic.comments.length}
                answers={0}
                vote={ratingsTotal}
                author={{
                  id: topic.user.id,
                  firstName: topic.user.firstName,
                  username: topic.user.username,
                }}
                changeRating={this.changeRating}
                history={this.props.history}
                hasRated={topic.ratings.some(
                  (r: any) => r.userId === this.context.user.id
                )}
                rating={topic.ratings.some(
                  (r: any) => r.userId === this.context.user.id && r.positive
                )}
              />
            );
          })}
        </TopicsContainer>
      </>
    );
  }
}

export default Home;

const ButtonPre = styled.div`
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 145, 173, 1);

  &:hover {
    color: rgba(0, 145, 173, 1);
    border: 1px solid rgba(255, 255, 255, 0.7);

    &:after {
      content: " +";
    }
  }
`;

export const Button = tw(ButtonPre)`
  bg-black
  px-5
  py-1
  rounded-2xl
`;

const UtilityBar = tw.div`
  flex
  justify-between
`;

const TopicsContainer = tw.div`flex flex-col gap-2 mt-4 font-sans`;
const TopicItem = tw.div`border rounded-lg border-white border-opacity-20 hover:border-opacity-40 p-2 flex flex-row gap-2 bg-black bg-opacity-25`;
const TopicVoting = tw.div`flex flex-col items-center px-4 pr-5 border-r border-white border-opacity-10`;
const TopicContent = tw.div`flex-grow pl-2`;
const TopicTitlePre = styled.div`
  font-family: "Montserrat", sans-serif;
`;
const TopicTitle = tw(TopicTitlePre)`text-lg`;
const TopicMeta = tw.div`flex justify-between text-sm`;
const TopicTags = tw.div``;
const TopicTagIconPre = styled.div``;
const TopicTagIcon = tw(TopicTagIconPre)`inline-block`;
const TopicTagItemPre = styled.div`
  &:hover div {
    color: rgba(0, 145, 173, 1);
  }
`;
const TopicTagItem = tw(
  TopicTagItemPre
)`inline-block text-white text-opacity-50 hover:text-white bg-black bg-opacity-10 border border-opacity-30 border-white rounded px-1 mx-1`;

const VotePre = styled.div`
  color: rgba(0, 145, 173, 1);
`;

const VoteUp = tw.div<{
  $active: boolean;
}>`cursor-pointer text-white ${(p) => (p.$active ? "" : "text-opacity-40")}`;
const VoteNum = tw(VotePre)``;
const VoteDown = tw.div<{
  $active: boolean;
}>`cursor-pointer text-white  ${(p) => (p.$active ? "" : "text-opacity-40")}`;

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
  changeRating?: CallableFunction;
  history: any;
  hasRated: boolean;
  rating: boolean;
};

const Topic = (props: TopicItemProps) => {
  return (
    <TopicItem>
      <TopicVoting>
        <VoteUp $active={props.hasRated && props.rating}>
          <FiChevronUp
            onClick={() => {
              props.changeRating && props.changeRating(props.id, true);
            }}
          />
        </VoteUp>
        <VoteNum>{props.vote}</VoteNum>
        <VoteDown $active={props.hasRated && !props.rating}>
          <FiChevronDown
            onClick={() => {
              props.changeRating && props.changeRating(props.id, false);
            }}
          />
        </VoteDown>
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
                      <TopicTagItem
                        onClick={(e) => {
                          e.preventDefault();
                          props.history.push(`/tag/${tag}`);
                        }}
                        key={uuid()}
                      >
                        <TopicTagIcon>
                          <FiTag className="inline-block" />
                        </TopicTagIcon>{" "}
                        {tag}
                      </TopicTagItem>
                    );
                  })
                  .reduce((prev, curr) => [prev, curr])}
            </TopicTags>
            <div className="">
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
