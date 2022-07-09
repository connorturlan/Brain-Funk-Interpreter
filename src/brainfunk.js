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

		if (this.memory[this.pointer] === 0) {
			let indent = 1;
			while (
				this.i + j < this.program.length &&
				this.program[this.i + j] != "]" &&
				indent != 0
			) {
				switch (this.program[this.i + j]) {
					case "[":
						indent++;
						break;
					case "]":
						indent--;
						break;
				}
				j++;
			}
		}

		return j;
	}

	// end a loop.
	loopEnd() {
		let j = 1;

		if (this.memory[this.pointer] !== 0) {
			j = -1;
			let indent = -1;
			while (
				this.i + j >= 0 &&
				this.program[this.i + j] != "[" &&
				indent != 0
			) {
				switch (this.program[this.i + j]) {
					case "[":
						indent++;
						break;
					case "]":
						indent--;
						break;
				}

				j--;
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
		this.pointer = 0;
		delete this.memory;
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

// create some example programs.
const oneToFive = "+.>++.>+++.>++++.>+++++.";
const addTwoNumbers = "+++>+++++[<+>-]";
const nestedLoops = "++[->+[>-<-]<]";
const helloWorld =
	"++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
/*`
[ This program prints "Hello World!" and a newline to the screen, its
length is 106 active command characters. [It is not the shortest.]

This loop is an "initial comment loop", a simple way of adding a comment
to a BF program such that you don't have to worry about any command
characters. Any ".", ",", "+", "-", "<" and ">" characters are simply
ignored, the "[" and "]" characters just have to be balanced. This
loop and the commands it contains are ignored because the current cell
defaults to a value of 0; the 0 value causes this loop to be skipped.
]
++++++++               Set Cell #0 to 8
[
  >++++               Add 4 to Cell #1; this will always set Cell #1 to 4
  [                   as the cell will be cleared by the loop
	  >++             Add 2 to Cell #2
	  >+++            Add 3 to Cell #3
	  >+++            Add 3 to Cell #4
	  >+              Add 1 to Cell #5
	  <<<<-           Decrement the loop counter in Cell #1
  ]                   Loop until Cell #1 is zero; number of iterations is 4
  >+                  Add 1 to Cell #2
  >+                  Add 1 to Cell #3
  >-                  Subtract 1 from Cell #4
  >>+                 Add 1 to Cell #6
  [<]                 Move back to the first zero cell you find; this will
					  be Cell #1 which was cleared by the previous loop
  <-                  Decrement the loop Counter in Cell #0
]                       Loop until Cell #0 is zero; number of iterations is 8

The result of this is:
Cell no :   0   1   2   3   4   5   6
Contents:   0   0  72 104  88  32   8
Pointer :   ^

>>.                     Cell #2 has value 72 which is 'H'
>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
+++++++..+++.           Likewise for 'llo' from Cell #3
>>.                     Cell #5 is 32 for the space
<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
<.                      Cell #3 was set to 'o' from the end of 'Hello'
+++.------.--------.    Cell #3 for 'rl' and 'd'
>>+.                    Add 1 to Cell #5 gives us an exclamation point
>++.                    And finally a newline from Cell #6
`;
*/
