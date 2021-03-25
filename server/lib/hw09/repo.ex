defmodule Hw09.Repo do
  use Ecto.Repo,
    otp_app: :hw09,
    adapter: Ecto.Adapters.Postgres
end
