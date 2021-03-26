defmodule Hw09.Users.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hw09.Events
  alias Hw09.Comments

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    has_many :events, Events.Event 
    has_many :comments, Comments.Comment
    
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    # TODO hasing
    attrs = Map.put(attrs, "password_hash", attrs["password"]);
    user
    |> cast(attrs, [:name, :email, :password_hash])
    |> validate_required([:email, :password_hash])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/^[\w.!#$%&’*+\-\/=?\^`{|}~]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/i)
  end
end
