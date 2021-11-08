import message

pub fn main() {
  log(message.hello("Gleam"))
}

external fn log(String) -> Nil =
  "" "console.log"
