import React from 'react';

import './App.css';

const audio = document.getElementById('beep');

class App extends React.Component {
	state = {
		breakLength: 5,
		sessionLength: 25,
		clockTime: 25 * 60,
		timerName: 'Session',
		isRunning: false,
	};
	constructor(props) {
		super(props);
		this.interval = undefined;
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	handleStartStop = () => {
		const { isRunning } = this.state;

		audio.pause();
		audio.currentTime = 0;

		if (isRunning) {
			clearInterval(this.interval);
			this.setState({
				isRunning: false,
			});
		} else {
			this.setState({
				isRunning: true,
			});

			this.interval = setInterval(() => {
				const {
					clockTime,
					breakLength,
					sessionLength,
					timerName,
				} = this.state;

				if (clockTime === 0) {
					audio.volume = 0.2;
					audio.play();
					if (timerName === 'Session') {
						this.setState({
							clockTime: breakLength * 60,
							timerName: 'Break',
						});
					} else {
						this.setState({
							clockTime: sessionLength * 60,
							timerName: 'Session',
						});
					}
				} else {
					this.setState({
						clockTime: clockTime - 1,
					});
				}
			}, 1000);
		}
	};

	handleReset = () => {
		const { sessionLength } = this.state;
		clearInterval(this.interval);

		audio.pause();
		audio.currentTime = 0;

		this.setState({
			clockTime: sessionLength * 60,
			timerName: 'Session',
			isRunning: false,
		});
	};

	handleBreakDecrease = () => {};
	handleBreakIncrease = () => {};
	handleSessionDecrease = () => {};
	handleSessionIncrease = () => {};

	convertTime = (count) => {
		let minutes = Math.floor(count / 60);
		let seconds = count % 60;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		return `${minutes}:${seconds}`;
	};

	handleLengthChange = (count, timerType) => {
		const {
			sessionLength,
			breakLength,
			timerName,
			isRunning,
		} = this.state;

		let newCount;

		if (timerType === 'session') {
			newCount = sessionLength + count;
		} else {
			newCount = breakLength + count;
		}

		if (newCount > 0 && newCount < 61 && !isRunning) {
			this.setState({
				[`${timerType}Length`]: newCount,
			});

			if (timerName.toLowerCase() === timerType) {
				this.setState({
					clockTime: newCount * 60,
				});
			}
		} else if (newCount > 0 && newCount < 61 && isRunning) {
			clearInterval(this.interval);
			this.setState({
				[`${timerType}Length`]: newCount,
				isRunning: false,
			});

			if (timerName.toLowerCase() === timerType) {
				this.setState({
					clockTime: newCount * 60,
				});
			}
		}
	};

	render() {
		const {
			breakLength,
			sessionLength,
			clockTime,
			timerName,
			isRunning,
		} = this.state;

		const breakProps = {
			title: 'Break',
			count: breakLength,
			handleDecrease: () => this.handleLengthChange(-1, 'break'),
			handleIncrease: () => this.handleLengthChange(1, 'break'),
		};

		const sessionProps = {
			title: 'Session',
			count: sessionLength,
			handleDecrease: () => this.handleLengthChange(-1, 'session'),
			handleIncrease: () => this.handleLengthChange(1, 'session'),
		};

		return (
			<div>
				<script src='https://unpkg.com/ionicons@5.0.0/dist/ionicons.js'></script>
				<div className='flex'>
					<SetTimer {...breakProps} />
					<SetTimer {...sessionProps} />
				</div>
				<div className='flex'>
					<div className='clock-container flex'>
						<h1 id='timer-label'>{timerName}</h1>
						<span className='clock' id='time-left'>
							{this.convertTime(clockTime)}
						</span>

						<div className='control-wraper'>
							<button id='start_stop' onClick={this.handleStartStop}>
								<ion-icon
									name={`${isRunning ? 'pause' : 'play'}`}></ion-icon>
							</button>
							<button id='reset' onClick={this.handleReset}>
								<ion-icon name='play-back'></ion-icon>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const SetTimer = (props) => {
	let id = props.title.toLowerCase();
	return (
		<div className='set-timer-container'>
			<h2 id={`${id}-label`} className='flex'>
				{props.title} Length
			</h2>
			<div className='flex control-wraper'>
				<button id={`${id}-decrement`} onClick={props.handleDecrease}>
					<ion-icon name='caret-down-outline'></ion-icon>
				</button>
				<span id={`${id}-length`} className='flex'>
					{props.count}
				</span>
				<button id={`${id}-increment`} onClick={props.handleIncrease}>
					<ion-icon name='caret-up-outline'></ion-icon>
				</button>
			</div>
		</div>
	);
};

export default App;
