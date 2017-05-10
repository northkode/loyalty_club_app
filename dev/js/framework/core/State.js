class State{
	constructor(state){
		this.state = state;
	}

	getState(){
		return this.state;
	}

	clone(){
		// clone the data of the previous state to break reference
		var cloneData = JSON.parse(JSON.stringify(this.getState()))
		return new State(cloneData);
	}
}
window.State = State;
export default State;
