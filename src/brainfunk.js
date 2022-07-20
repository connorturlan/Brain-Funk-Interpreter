function sleep(ms) {
	let start = Date.now();
	let now = start;

	while (now - start < ms) {
		now = Date.now();
	}
}

function print(string) {
	console.log(string);
	document.getElementById("program-output").value += string;
}

/*
A class to store the Brainfunk interpreter
the program can be set using obj.setProgram(string)
and execution can be performed with obj.start()

if a single step is required, obj.step() executes the current instruction
*/
class BFInterpreter {
	constructor(newProgram = "") {
		this.mPtr = 0;
		this.memory = [0];

		this.iPtr = 0;
		this.program = newProgram;

		this.input = "";

		this.instructions = "<>+-[].,:";

		console.log("Hello, World!");
	}

	// increment the data pointer.
	DPIncrement() {
		this.mPtr++;

		// extend the memory if the pointer exceeds the current length.
		if (this.mPtr >= this.memory.length) {
			this.memory.push(0);
		}

		// detect min errors
		if (this.memory.at(this.mPtr) > 2 ** 8) {
			this.end();
		}

		return true;
	}

	// decrement the data pointer.
	DPDecrement() {
		this.mPtr--;

		// floor the pointer to 0 if the pointer drops below zero.
		if (this.mPtr < 0) {
			/* this.memory.shift(0); */
			this.mPtr = 0;
		}

		// detect min errors
		if (this.memory.at(this.mPtr) < -(2 ** 8)) {
			this.end();
		}

		return true;
	}

	// increment the value at the pointer.
	memoryIncrement() {
		this.memory[this.mPtr]++;

		return true;
	}

	// decrement the value at the pointer.
	memoryDecrement() {
		this.memory[this.mPtr]--;

		return true;
	}

	// output the value at the pointer.
	output() {
		let id = this.memory.at(this.mPtr);
		print(String.fromCharCode(id));
		return true;
	}

	// write input to the memory buffer.
	input() {
		return 1;
	}

	// output the value at the pointer.
	outputInteger() {
		let id = this.memory.at(this.mPtr);
		//console.log(`value at ${this.mPtr}: ${id}`);
		print(id);
		return true;
	}

	// begin a loop, repeat while the value at the memory pointer is non-zero.
	loopBegin() {
		if (this.memory[this.mPtr] === 0) {
			let indent = 0;
			while (this.iPtr < this.program.length) {
				let inst = this.program[this.iPtr];

				if (inst === "[") {
					indent++;
				} else if (inst === "]") {
					indent--;
					if (indent <= 0) {
						break;
					}
				}

				this.iPtr++;
			}
		}

		return true;
	}

	// end a loop.
	loopEnd() {
		if (this.memory[this.mPtr] !== 0) {
			let indent = 0;
			while (this.iPtr >= 0) {
				let inst = this.program[this.iPtr];

				if (inst === "[") {
					indent++;
					if (indent >= 0) {
						break;
					}
				} else if (inst === "]") {
					indent--;
				}

				this.iPtr--;
			}
		}

		return true;
	}

	step(tkn) {
		let token = this.program[this.iPtr];
		/* return token in this.instructions ? this.instructions[token]() : false; */
		switch (token) {
			// pointer methods.
			case ">":
				return this.DPIncrement();
			case "<":
				return this.DPDecrement();

			// memory methods.
			case "+":
				return this.memoryIncrement();
			case "-":
				return this.memoryDecrement();

			// IO methods.
			case ".":
				return this.output();
			case ",":
				return this.input();
			case ":":
				return this.outputInteger();

			// looping methods.
			case "[":
				return this.loopBegin();
			case "]":
				return this.loopEnd();

			default:
				return false;
		}
	}

	// loop through the program.
	loop() {
		// loop through
		while (this.iPtr < this.program.length) {
			this.step(this.program[this.iPtr]);
			this.iPtr++;
		}
	}

	// start interpretting the program.
	start() {
		// reset memory.
		this.iPtr = 0;
		this.mPtr = 0;
		delete this.memory;
		this.memory = [0];

		this.loop();

		// output the contents of memory.
		console.log(this.memory);

		return 0;
	}

	// end the program if there is an error
	end() {
		console.log("ERROR, value exceeded.");

		this.iPtr = this.program.length;

		return false;
	}

	// set the program of the interpreter.
	setProgram(newProgram) {
		this.program = newProgram;
		return true;
	}

	// reduce the program to be only accepted characters.
	reduceProgram(replace) {
		let newProgram = "";
		for (let char of this.program) {
			if (this.instructions.indexOf(char) >= 0) {
				newProgram += char;
			}
		}
		if (replace) this.setProgram(newProgram);
		return newProgram;
	}
}

// create some example programs.
const oneToFive = "+.>++.>+++.>++++.>+++++.";

// create some useful programs.
const _COPY = `
copy m0 to m1 and m2
[	while (m0 gt 0) {
	-	sub 1 from m0
	>+	add 1 to m1
	>+	add 1 to m2
	<<	rtn to m0
] }
`;

const COPY = `
COPY m0 to m1 inplace
${_COPY}

move m2 to m0
>>	mov m2
[	while (m2 gt 0) {
	-	sub 1 from m2
	<<+	add 1 to m0
	>>	rtn to m2
] }
<<	return to m0
`;

const ADD = `ADD >[-<+>]`;
const SUB = `SUB >[-<->]`;

const MULT = `
MULT
[
	>[->+>+<<]	copy B to b and c
	>[-<+>]	mov b to B
	<<-	sub 1 from A
]

>>>[-<<<+>>>]	mov c to C
<<[-]<	zero B
`;

const helloWorld = `
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

The result of this is
Cell no    0   1   2   3   4   5   6
Contents   0   0  72 104  88  32   8
Pointer    ^

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

// create a test machine and program to print from 1 to 5.
const machine = new BFInterpreter(helloWorld);

// link the form to the machine.
document.getElementById("load-program").addEventListener("click", (event) => {
	machine.setProgram(document.getElementById("input-program").value);
	machine.reduceProgram(true);
});

document.getElementById("run-program").addEventListener("click", (event) => {
	document.getElementById("program-output").value = "";
	machine.start();
});

document.getElementById("run-program").addEventListener("click", (event) => {
	machine.step();
	machine.iPtr++;
});

document.getElementById("loop-program").addEventListener("click", (event) => {
	machine.loop();
});
