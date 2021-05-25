import * as React from "react";
import tw from "tailwind-styled-components";
import { FiChevronDown, FiChevronUp, FiTag } from "react-icons/fi";
import uuid from "react-uuid";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
import { IRating, ITag, ITopic } from "../interfaces";
import Loading from "../components/Loading";

export interface HomeProps extends RouteComponentProps {}

export interface HomeState {
  topics: ITopic[];
  page: number;
  scrollInterval?: NodeJS.Timer;
  fetching: boolean;
}

class Home extends React.Component<HomeProps, HomeState> {
  static contextType = UserContext;

  constructor(props: HomeProps) {
    super(props);
    this.state = {
      topics: [],
      page: 0,
      scrollInterval: undefined,
      fetching: false,
    };
  }

  checkScroll = () => {
    if (
      window.innerHeight + window.pageYOffset >= document.body.scrollHeight &&
      !this.state.fetching &&
      this.state.page !== -1
    ) {
      console.log("rock bottom buddy");
      this.setState(
        {
          fetching: true,
          page: this.state.page + 1,
        },
        () => {
          this.fetchPage();
        }
      );
    }
  };

  componentDidMount() {
    this.fetchTopics();
    this.setState({
      scrollInterval: setInterval(() => {
        this.checkScroll();
      }, 1000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.scrollInterval!);
  }

  fetchTopics = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/topics`)
      .then((res) => {
        return res.json();
      })
      .then((data: ITopic[]) => {
        this.setState({
          topics: data,
        });
      });
  };

  fetchPage = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/topics/page/${this.state.page}`)
      .then((res) => {
        return res.json();
      })
      .then((data: ITopic[]) => {
        this.setState({
          topics: [...this.state.topics, ...data],
          fetching: false,
          page: data.length === 0 ? -1 : this.state.page,
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
          {this.state.topics.map((topic: ITopic) => {
            const ratingsTotal = topic.ratings!.reduce(
              (a: number, c: IRating) => (a += c.positive ? 1 : -1),
              0
            );
            return (
              <Topic
                key={uuid()}
                id={topic.id}
                title={topic.title}
                tags={topic.tags!.map((tag: ITag) => tag.name)}
                comments={topic.comments!.length}
                answers={0}
                vote={ratingsTotal}
                author={{
                  id: topic.user!.id,
                  firstName: topic.user!.firstName,
                  username: topic.user!.username,
                }}
                changeRating={this.changeRating}
                history={this.props.history!}
                hasRated={
                  this.context.isAuth &&
                  topic.ratings!.some(
                    (r: IRating) => r.userId === this.context.user.id
                  )
                }
                rating={
                  this.context.isAuth &&
                  topic.ratings!.some(
                    (r: IRating) =>
                      r.userId === this.context.user.id && r.positive
                  )
                }
              />
            );
          })}
          {this.state.fetching && <Loading />}
          <TheEnd>{this.state.page === -1 && <>That's all folks!</>}</TheEnd>
        </TopicsContainer>
      </>
    );
  }
}

export default withRouter(Home);
const TheEndPre = styled.div`
  font-family: "Dancing Script", cursive;
`;
const TheEnd = tw(TheEndPre)`w-full text-center text-5xl mt-10`;

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
const Author = styled.span`
  color: rgba(0, 145, 173, 1);
`;

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
  history: RouteComponentProps["history"];
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
              {props.comments} comment{props.comments === 1 ? "" : "s"} | by{" "}
              <Link to={`/profile/${props.author.id}`}>
                <Author>
                  {props.author.firstName} ({props.author.username})
                </Author>
              </Link>
            </div>
          </TopicMeta>
        </Link>
      </TopicContent>
    </TopicItem>
  );
};
