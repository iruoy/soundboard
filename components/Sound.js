import { Component } from 'react';

class Sound extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0
        }
    }

    componentDidMount() {
        this.audio = new Audio(this.props.src);

        this.audio.addEventListener('timeupdate', (event) => {
            this.setState({ progress: this.audio.currentTime / this.audio.duration * 100 });
        });
    }

    play() {
        this.audio.fastSeek(0);
        this.audio.play();
    }

    render() {
        return (
            <div className="m-4 p-6 text-left cursor-pointer select-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors hover:border-blue-500 focus:border-blue-500" onClick={this.play.bind(this)}>
                <h3 className="mb-4 text-2xl font-bold">{this.props.title}</h3>

                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-300 dark:bg-blue-700">
                        <div style={{ width: this.state.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sound;
