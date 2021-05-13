import * as React from "react";

type ContextProps = {};

const UserContext = React.createContext<Partial<ContextProps>>({});
export default UserContext;

export interface UserContextProviderProps {}

export interface UserContextProviderState {
  token: string | null;
  isAuth: boolean;
  user: any;
  role: number;
}

export class UserContextProvider extends React.Component<
  UserContextProviderProps,
  UserContextProviderState
> {
  constructor(props: UserContextProviderProps) {
    super(props);
    this.state = {
      token: null,
      isAuth: false,
      user: {},
      role: 0,
    };
  }

  componentDidMount() {
    this.setState({
      token: localStorage.getItem("token"),
    });
  }

  componentDidUpdate(
    prevProps: UserContextProviderProps,
    prevState: UserContextProviderState
  ) {
    if (this.state.token !== prevState.token) {
      if (this.state.token) {
        localStorage.setItem("token", this.state.token);

        fetch(`${process.env.REACT_APP_SERVER_URL!}/users/`, {
          headers: new Headers({ Authorization: `Bearer ${this.state.token}` }),
        })
          .then((res) => {
            if (res.status !== 200) {
              this.setState({
                token: null,
                isAuth: false,
                user: {},
              });

              localStorage.removeItem("token");
            }

            return res.json();
          })
          .then((data) => {
            if (data.user) {
              this.setState({
                isAuth: true,
                user: data.user,
              });
            }
          });
      } else {
        this.setState({
          isAuth: false,
          user: {},
        });

        localStorage.removeItem("token");
      }
    }
  }

  setToken = (token: string | null) => {
    this.setState({
      token: token,
    });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          token: this.state.token,
          setToken: this.setToken,
          isAuth: this.state.isAuth,
          role: this.state.role,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
