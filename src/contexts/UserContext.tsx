import * as React from "react";

export type ContextProps = {
  token: string | null;
  isAuth: boolean;
  setToken: CallableFunction;
  user: {};
};

const UserContext = React.createContext<ContextProps>({
  token: null,
  isAuth: false,
  setToken: (token: string | null) => {},
  user: {},
});

export default UserContext;

export interface UserContextProviderProps {}

export interface UserContextProviderState {
  token: string | null;
  isAuth: boolean;
  user: any;
  isLoading: boolean;
}

export class UserContextProvider extends React.Component<
  UserContextProviderProps,
  UserContextProviderState
> {
  constructor(props: UserContextProviderProps) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      isAuth: false,
      user: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    this.validateToken();
  }

  componentDidUpdate(
    prevProps: UserContextProviderProps,
    prevState: UserContextProviderState
  ) {
    if (this.state.token !== prevState.token) {
      this.validateToken();
    }
  }

  validateToken = () => {
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
              isLoading: false,
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
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isAuth: false,
        user: {},
        isLoading: false,
      });

      localStorage.removeItem("token");
    }
  };

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
          user: this.state.user,
        }}
      >
        {!this.state.isLoading && this.props.children}
      </UserContext.Provider>
    );
  }
}
