import gleam/string

pub fn hello(origin: String) -> String {
  string.append(to: "hello from ", suffix: origin)
}
