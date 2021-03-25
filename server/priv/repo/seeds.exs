# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Hw09.Repo.insert!(%Hw09.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Hw09.Repo
alias Hw09.Users.User

alice = Repo.insert!(%User{name: "alice", email: "hello", password_hash: "123"})
bob = Repo.insert!(%User{name: "bob", email: "hello", password_hash: "123"})