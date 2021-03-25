defmodule Hw09Web.EventController do
  use Hw09Web, :controller

  alias Hw09.Events
  alias Hw09.Events.Event

  alias Hw09.Plugs

  plug Plugs.RequireAuth when action in [:create]
  # Fetch event to @conn 
  plug :fetch_event when action in [:show, :photo, :edit, :update, :delete]
  # Requires the event owner in update/edit/delete
  # plug :require_owner when action in [:edit, :update, :delete]

  action_fallback Hw09Web.FallbackController

  def fetch_event(conn, _args) do
    id = conn.params["id"]
    event = Events.get_event!(id)
    assign(conn, :event, event)
  end 

  # def require_owner(conn, args) do
    # if is_owner?(conn, conn.assigns[:event].id) do
    #   conn
    # else 
    #   conn
    #   |> put_flash(:error, "No access")
    #   |> redirect(to: Routes.page_path(conn, :index))
    #   |> halt()
    # end
  # end
 

  def index(conn, _params) do
    events = Events.list_events()
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
        |> send_resp(422, Jason.encode!(%{error: "Failed Creation"}))
    end
  end

  def show(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    |> Events.load_comment()
    |> Events.load_invite()
    responses= 
    count_response(event.invites)
    |> Enum.map_join(", ", fn {key, val} -> "#{key}: #{val}" end)

    event = Map.put(event, :responses, responses)
    result = render(conn, "preload_event.json", event: event)
    IO.inspect(result)
    result
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      render(conn, "show.json", event: event)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
