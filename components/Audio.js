import { Component } from 'react';

const slugify = require('@sindresorhus/slugify');

class Audio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0
        }

        this.slug = slugify(this.props.src);
    }

    updateProgress() {
        this.setState({ progress: this.audio.currentTime / this.audio.duration * 100 });
    }

    play() {
        this.audio = document.getElementById(this.slug);

        this.audio.fastSeek(0);
        this.audio.play();
    }

    render() {
        return (
            <div className="m-4 p-6 text-left border border-gray-200 rounded-lg transition-colors hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500" onClick={this.play.bind(this)}>
                <h3 className="mb-4 text-2xl font-bold">{this.props.title}</h3>

                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div style={{ width: this.state.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                </div>

                <audio id={this.slug} src={this.props.src} onTimeUpdate={this.updateProgress.bind(this)}>
                    <p>Your browser does not support the <code>audio</code> element.</p>
                </audio>
            </div>
        );
    }
}

export default Audio;
