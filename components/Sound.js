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
      <div className="min-w-full p-4 cursor-pointer select-none bg-black text-white border-8 border-black hover:border-white focus:border-white" onClick={this.play.bind(this)}>
        <div className="flex justify-between items-baseline">
          <p className="text-2xl font-bold">{this.props.title}</p>
          {/*<p className="font-mono">{this.state.currentTime} / {this.state.duration}</p>*/}
        </div>
        <div className="mt-4 relative">
          <div className="h-2 flex bg-gray-400">
            <div style={{width: this.state.progress + '%'}} className="bg-yellow-400"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Sound;
