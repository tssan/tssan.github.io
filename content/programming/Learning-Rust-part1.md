Title: Learning Rust - part1
Summary: Setup of Rust project using cargo. Little bit more than a simple "hello world".
Date: 2022-01-12
Tags: cargo, rust, crypto



# Preface

Recently I started learning Rust language. I hava an idea for a simple crypto currency portfolio project. I figure out that I can learn and make something useful so I will create series about coding my first application in Rust language. Step by step I will try to implement crypto portfolio application. It will be a simple command line tool.

>! This is not a tutorial for beginner programmers. It is for beginner Rust programmer and general programming knowledge will be required.

# Prerequisites

* Installed `rustc`, `cargo`. Recommended way for installation is to use `rustup`. More information here: https://www.rust-lang.org/tools/install Below are te versions I will be using during this series:

```bash
➜  ~ cargo -V
cargo 1.57.0 (b2e52d7ca 2021-10-21)
➜  ~ rustc -V
rustc 1.57.0 (f1edd0429 2021-11-29)
➜  ~ rustup -V
rustup 1.24.3 (ce5817a94 2021-05-31)
```

> `Cargo` is a Rust's build system and package manager

# Project's assumtions and goals.

Core:

* offline
* manage list of crypto assets (mainly crypto currencies, maybe also NFTs)
* show total value of all assets
* interface: command line
* read and save data files


# Initialize project

You can create everything manually but since we have **cargo** just run:

`➜  cargo new crypto-portfolio`

Project folders and files structure should look like this:

```bash
➜  crypto-portfolio git:(master) ✗ tree -a .
.
├── .git
│  └── ..
├── .gitignore
├── Cargo.toml
└── src
    └── main.rs
```

Inside `main.rs` file by default we have "hello world" program. You can compile and run it usign **cargo**:

`➜  cargo run`

# Read command line arguments

> Official docs: https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html


First of we need to bring `args` function from `std` library. From docs: "It is conventional to bring the parent module into scope rather than the function."

```rust
use std::env;
```

Then we can actually use it like this:

```rust
let args: Vec<String> = env::args().collect();
println!("{:?}", args);
```

Function `args` returns an `Iterator` that is why we have to run additional function `collect`. Second line `println` is a macro and `{:?}` is debug formatting.

Ok. Now we have an array of arguments. If you compile and run this code you will notice that a first element of this array is a name of a program (relative path eg.: `target/debug/crypto-portfolio`). If you run `cargo run test` then printed `args` should looks like this: `["target/debug/crypto-portfolio", "test"]`.

Next lets try to handle command line first argument as it is an action name like so:

`➜  ./crypto-portfolio <action-name>`

For now we use a simple `if` statement and maybe ask for **action** name if not given.

```rust
use std::io;

if args.len() > 1 {
    println!("Runing action: {}", args[1]);
} else {
    println!("Enter action name please: ");
    let mut buffer = String::new();
    io::stdin().read_line(&mut buffer).unwrap();
    println!("Runing action: {}", buffer);
}
```

First we must bring **io** into the scope. Then we declare `buffer` variable. And finally using `io::stdin().read_line` function we are updating `buffer` variable.

As you probably noticed, after `read_line` function we call another function `unwrap`. This is done because `read_line` returns `Result<T, E>` that must be handled and function `unwrap` is doing that for us. This is not a best practice because program can still **panic**. For now lets leave it as it is. I'm sure we learn about proper handling that kind of situations in next episodes.

Full example:

```rust
use std::env;
use std::io;


fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 {
        println!("Runing action: {}", args[1]);
    } else {
        println!("Enter action name: ");
        let mut buffer = String::new();
        io::stdin().read_line(&mut buffer).unwrap();
        println!("Runing action: {}", buffer);
    }
}
```

# Takeaways

* **io::stdout()** -> **println!** is a macro that is printing to the standard output given string. At this point it is unclear for me why this is done by macro. For sure I want to cover macros subject in future articles.
* **use** - with this *keyowrd* we bring required parts of library into the current scope
* **Vec** type - list with dynamically allocated size
* **let** vs **let mut** - in Rust by default all variables are immutable, **mut** keyword make variable mutable


# Summary

Not much to discuss here. Little more complex than simple "hello world" first program is done! :)

# Next

I would like to learn how to separate code in files, modules etc..
