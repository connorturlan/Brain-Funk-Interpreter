# Brain-Funk-Interpreter

Brainfunk is an esoteric programing language designed to use the minimum amount of instructions while still being Turing complete.

'>' Increment the data pointer (to point to the next cell to the right).

'<' Decrement the data pointer (to point to the next cell to the left).

'+' Increment (increase by one) the byte at the data pointer.

'-' Decrement (decrease by one) the byte at the data pointer.

. Output the byte at the data pointer.

, Accept one byte of input, storing its value in the byte at the data pointer.

[ If the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching ] command.

] If the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching [ command.

This repo contains an interpreter and some example programs to begin, including ADDing, SUBtracting, MULTiplying.
