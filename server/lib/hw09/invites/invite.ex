defmodule Hw09.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hw09.Events
  alias Hw09.Users

  schema "invites" do
    field :response, :string, default: "unresponded"
    belongs_to :event, Events.Event
    belongs_to :user,  Users.User

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :event_id, :user_id])
    |> unique_constraint([:event_id, :user_id])
    |> validate_required([:response, :event_id, :user_id])
  end
end
