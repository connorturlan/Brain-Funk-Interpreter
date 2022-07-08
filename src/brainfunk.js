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
	constructor(newProgram = "") {
		this.pointer = 0;
		this.memory = [0];

		this.program = newProgram;

		console.log("Hello, World!");
	}

	// increment the data pointer.
	DPIncrement() {
		this.pointer++;

		// extend the memory if the pointer exceeds the current length.
		if (this.pointer >= this.memory.length) {
			this.memory.push(0);
		}

		return 1;
	}

	// decrement the data pointer.
	DPDecrement() {
		this.pointer--;

		// floor the pointer to 0 if the pointer drops below zero.
		if (this.pointer < 0) {
			this.pointer = 0;
		}

		return 1;
	}

	// increment the value at the pointer.
	memoryIncrement() {
		this.memory[this.pointer]++;

		return 1;
	}

	// decrement the value at the pointer.
	memoryDecrement() {
		this.memory[this.pointer]--;

		return 1;
	}

	// output the value at the pointer.
	output() {
		let id = this.memory.at(this.pointer);
		console.log(String.fromCharCode(id));

		return 1;
	}

	// write input to the memory buffer.
	input() {
		return 1;
	}

	// begin a loop, repeat while the value at the memory pointer is non-zero.
	loopBegin() {
		let j = 1;

		if (this.memory[this.pointer] == 0) {
			let indent = 0;
			while (this.program[this.i + j] != "]" && indent > 0) {
				switch (this.program[this.i + j]) {
					case "[":
						indent++;
						break;
					case "]":
						indent--;
						break;
				}

				j++;

				if (j > 10000) {
					break;
				}
			}
		}

		return j;
	}

	// end a loop.
	loopEnd() {
		let j = -1;

		if (this.memory[this.pointer] != 0) {
			let indent = 0;
			while (this.program[this.i + j] != "[" && indent > 0) {
				switch (this.program[this.i + j]) {
					case "[":
						indent--;
						break;
					case "]":
						indent++;
						break;
				}

				j--;

				if (j < -10000) {
					break;
				}
			}
		}

		return j;
	}

	step(token) {
		switch (token) {
			case ">":
				return this.DPIncrement();
			case "<":
				return this.DPDecrement();

			case "+":
				return this.memoryIncrement();
			case "-":
				return this.memoryDecrement();

			case ".":
				return this.output();
			case ",":
				return this.input();

			case "[":
				return this.loopBegin();
			case "]":
				return this.loopEnd();

			default:
				return 1;
		}
	}

	// start interpretting the program.
	start() {
		this.i = 0;

		// reset memory.
		this.memory = [0];

		// loop through
		while (this.i < this.program.length) {
			this.i += this.step(this.program[this.i]);
		}

		// output the contents of memory.
		console.log(this.memory);

		return 0;
	}

	// set the program of the interpreter.
	setProgram(newProgram) {
		this.program = newProgram;

		return true;
	}
}

// create a test machine and program to print from 1 to 5.
const machine = new BFInterpreter("");
machine.setProgram("+.>++.>+++.>++++.>+++++.");
