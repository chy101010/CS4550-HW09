defmodule Hw09Web.EventController do
  use Hw09Web, :controller

  alias Hw09.Events
  alias Hw09.Events.Event

  alias Hw09Web.Plugs

  plug Plugs.RequireAuth when action in [:index, :create, :update, :delete]
  # User must fully Register to use the site
  plug Plugs.RequireRegistration when action in [:create, :update, :delete]
  # Fetch event to @conn 
  plug :fetch_event when action in [:show, :update, :delete]
  # Requires the event owner in update/edit/delete
  plug Plugs.RequireEventOwner when action in [:update, :delete]

  action_fallback Hw09Web.FallbackController

  def fetch_event(conn, _args) do
    id = conn.params["id"]
    event = Events.get_event!(id)
    assign(conn, :event, event)
  end 
 

  def index(conn, _params) do
    # events = Events.list_events();
    owned_events = Events.get_events_owned(conn.assigns[:user].id)
    invited_events = Events.get_events_invited(conn.assigns[:user].id)
    events = owned_events ++ invited_events
    render(conn, "index.json", events: events)
  end

  def dateMap(date) do
    result = 
    %{}
    |> Map.put("month", String.slice(date, 5, 2))
    |> Map.put("day", String.slice(date, 8, 2))
    |> Map.put("year", String.slice(date, 0, 4))
    |> Map.put("hour", String.slice(date, 11, 2))
    |> Map.put("minute", String.slice(date, 14, 2))
    %{"date" => result};
  end

  def create(conn, event_params) do
    params = 
    event_params
    |> Map.pop("date")
    |> elem(1)
    |> Map.merge(dateMap(Map.get(event_params, "date")))
    |> Map.put("user_id", conn.assigns[:user].id)
    case Events.create_event(params) do
      {:ok, event} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.event_path(conn, :show, event))
        |> render("show.json", event: event)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Failed Creation"}))
    end
  end

  def show(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    |> Events.load_comment()
    |> Events.load_invite()
    |> Events.load_user()
    
    responses= 
    count_response(event.invites)
    |> Enum.map_join(", ", fn {key, val} -> "#{key}: #{val}" end)
    event = Map.put(event, :responses, responses)
    
    render(conn, "show_preload.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = conn.assigns[:event]
    case Events.update_event(event, event_params) do
      {:ok, event} ->
        conn
        |> put_status(:accepted)
        |> render("show.json", event: event)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Failed Update"}))
    end 
  end

  def delete(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
