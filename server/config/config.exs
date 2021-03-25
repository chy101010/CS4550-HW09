# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :hw09,
  ecto_repos: [Hw09.Repo]

# Configures the endpoint
config :hw09, Hw09Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "N2wNgANoJSfEg2FFmdcufa2K+zNe6sCH1vTl7JSMeVRHGJiBJWrQCS/GrhdPcOF5",
  render_errors: [view: Hw09Web.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Hw09.PubSub,
  live_view: [signing_salt: "fVl/XU8i"]

config :cors_plug,
  origin: ["http://localhost:3000"],
  max_age: 86400,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  headers: ["x-auth"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
