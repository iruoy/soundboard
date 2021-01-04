import {Component} from 'react';

class Sound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: '00:00',
      duration: '00:00',
      progress: 0
    }
  }

  componentDidMount() {
    this.audio = new Audio(this.props.src);

    this.audio.addEventListener('timeupdate', () => {
      this.setState({
        currentTime: this.format(this.audio.currentTime),
        duration: this.format(this.audio.duration),
        progress: this.audio.currentTime / this.audio.duration * 100
      });
    });
  }

  format(seconds) {
    const date = new Date(seconds * 1000);

    return date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
  }

  play() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
      this.audio.fastSeek(0);
    }
  }

  render() {
    return (
      <div className="m-4 p-6 cursor-pointer select-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors hover:border-blue-500 focus:border-blue-500" onClick={this.play.bind(this)}>
        <div className="mb-4 flex justify-between items-baseline">
          <h2 className="text-2xl font-bold">{this.props.title}</h2>
          <p className="font-mono">{this.state.currentTime} / {this.state.duration}</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-300 dark:bg-blue-700">
            <div style={{width: this.state.progress + '%'}} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Sound;
