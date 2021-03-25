defmodule Hw09.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hw09.Users
  alias Hw09.Comments
  alias Hw09.Invites

  schema "events" do
    field :date, :utc_datetime
    field :description, :string
    field :name, :string
    belongs_to :user, Users.User

    has_many :comments, Comments.Comment
    has_many :invites, Invites.Invite

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:description, :date, :name, :user_id])
    |> validate_required([:description, :date, :name, :user_id])
  end
end
