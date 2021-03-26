defmodule Hw09.Events do
  @moduledoc """
  The Events context.
  """

  import Ecto.Query, warn: false
  alias Hw09.Repo

  alias Hw09.Events.Event
  alias Hw09.Invites.Invite

  @doc """
  Returns the list of events.

  ## Examples

      iex> list_events()
      [%Event{}, ...]

  """
  def list_events do
    Repo.all(Event)
  end

  @doc """
  Gets a single event.

  Raises `Ecto.NoResultsError` if the Event does not exist.

  ## Examples

      iex> get_event!(123)
      %Event{}

      iex> get_event!(456)
      ** (Ecto.NoResultsError)

  """
  def get_event!(id), do: Repo.get!(Event, id)

  @doc """
  Creates a event.

  ## Examples

      iex> create_event(%{field: value})
      {:ok, %Event{}}

      iex> create_event(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_event(attrs \\ %{}) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a event.

  ## Examples

      iex> update_event(event, %{field: new_value})
      {:ok, %Event{}}

      iex> update_event(event, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_event(%Event{} = event, attrs) do
    event
    |> Event.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a event.

  ## Examples

      iex> delete_event(event)
      {:ok, %Event{}}

      iex> delete_event(event)
      {:error, %Ecto.Changeset{}}

  """
  def delete_event(%Event{} = event) do
    Repo.delete(event)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking event changes.

  ## Examples

      iex> change_event(event)
      %Ecto.Changeset{data: %Event{}}

  """

  def load_comment(%Event{} = event) do
    Repo.preload(event, [comments: :user])
  end

  def load_invite(%Event{} = event) do
    Repo.preload(event, [invites: :user])
  end
  
  def load_user(%Event{} = event) do
    Repo.preload(event, [:user])
  end

  def change_event(%Event{} = event, attrs \\ %{}) do
    Event.changeset(event, attrs)
  end


  def get_events_owned(user_id) do 
    query = from(e in Event, where: e.user_id == ^user_id, select: e)
    Repo.all(query)
  end 

  def get_events_invited(user_id) do
    query  = from(
      e in Event, 
      join: inv in Invite,
      on: e.id == inv.event_id, 
      where: inv.user_id == ^user_id,
      select: e)
    Repo.all(query)
  end
  
end
