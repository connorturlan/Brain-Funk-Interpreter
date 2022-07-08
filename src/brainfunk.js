/*
Character 	Meaning
	> 	Increment the data pointer (to point to the next cell to the right).
	< 	Decrement the data pointer (to point to the next cell to the left).
	+ 	Increment (increase by one) the byte at the data pointer.
	- 	Decrement (decrease by one) the byte at the data pointer.
	. 	Output the byte at the data pointer.
	, 	Accept one byte of input, storing its value in the byte at the data pointer.
	[ 	If the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching ] command.
	] 	If the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching [ command.
*/

class BFInterpreter {
	constructor() {
		this.pointer = 0;
		this.memory = [0];

		this.program = "";
	}

	// increment the data pointer.
	DPInc() {
		this.pointer++;

		// extend the memory if the pointer exceeds the current length.
		if (this.pointer >= this.memory.length) {
			this.memory.push(0);
		}
	}

	// decrement the data pointer.
	DPDec() {
		this.pointer--;

		// floor the pointer to 0 if the pointer drops below zero.
		if (this.pointer < 0) {
			this.pointer = 0;
		}
	}
}
