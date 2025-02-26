class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      timeLeft: 25 * 60,
      isRunning: false,
      timerMode: "session",
    };
    this.handleClick = this.handleClick.bind(this);
    this.timer = null;
    this.audioRef = React.createRef();
  }

  handleClick(e) {
    const id = e.target.id;

    if (id === "break-decrement" && this.state.breakLength > 1) {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength - 1,
        timeLeft:
          !prevState.isRunning && prevState.timerMode === "break"
            ? (prevState.breakLength - 1) * 60
            : prevState.timeLeft,
      }));
    } else if (id === "break-increment" && this.state.breakLength < 60) {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength + 1,
        timeLeft:
          !prevState.isRunning && prevState.timerMode === "break"
            ? (prevState.breakLength + 1) * 60
            : prevState.timeLeft,
      }));
    } else if (id === "session-decrement" && this.state.sessionLength > 1) {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength - 1,
        timeLeft:
          !prevState.isRunning && prevState.timerMode === "session"
            ? (prevState.sessionLength - 1) * 60
            : prevState.timeLeft,
      }));
    } else if (id === "session-increment" && this.state.sessionLength < 60) {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength + 1,
        timeLeft:
          !prevState.isRunning && prevState.timerMode === "session"
            ? (prevState.sessionLength + 1) * 60
            : prevState.timeLeft,
      }));
    } else if (id === "start_stop") {
      this.setState(
        { isRunning: !this.state.isRunning },
        () => {
          if (this.state.isRunning) {
            this.timer = setInterval(() => {
              if (this.state.timeLeft > 0) {
                this.setState({ timeLeft: this.state.timeLeft - 1 });
              } else if (this.state.timeLeft === 0) {
                this.audioRef.current.play();
                if (this.state.timerMode === "session") {
                  this.setState({
                    timerMode: "break",
                    timeLeft: this.state.breakLength * 60,
                  });
                } else {
                  this.setState({
                    timerMode: "session",
                    timeLeft: this.state.sessionLength * 60,
                  });
                }
              }
            }, 1000);
          } else {
            clearInterval(this.timer);
          }
        }
      );
    } else if (id === "reset") {
      this.setState({
        sessionLength: 25,
        breakLength: 5,
        timeLeft: 25 * 60,
        isRunning: false,
        timerMode: "session",
      });
      clearInterval(this.timer);
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0;
    }
  }

  render() {
    const minutes = Math.floor(this.state.timeLeft / 60);
    const seconds = this.state.timeLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    return (
      <div>
        <div id="break-label">Break Length</div>
        <button id="break-decrement" onClick={this.handleClick}>-</button>
        <span id="break-length">{this.state.breakLength}</span>
        <button id="break-increment" onClick={this.handleClick}>+</button>

        <div id="session-label">Session Length</div>
        <button id="session-decrement" onClick={this.handleClick}>-</button>
        <span id="session-length">{this.state.sessionLength}</span>
        <button id="session-increment" onClick={this.handleClick}>+</button>

        <div id="timer-label">{this.state.timerMode === "session" ? "Session" : "Break"}</div>
        <span id="time-left">{formattedTime}</span>
        <button id="start_stop" onClick={this.handleClick}>Start/Stop</button>
        <button id="reset" onClick={this.handleClick}>Reset</button>

        <audio id="beep" ref={this.audioRef} src="https://www.soundjay.com/buttons/beep-07.mp3" />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
