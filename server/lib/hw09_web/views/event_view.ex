defmodule Hw09Web.EventView do
  use Hw09Web, :view
  alias Hw09Web.EventView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("preload_event.json", %{event: event}) do
    result = %{id: event.id,
      description: event.description,
      date: event.date,
      name: event.name,
      invites: Enum.map(event.invites, fn invite -> render(Hw09Web.InviteView, "show.html") end),
      comments: Enum.map(event.comments, fn invite -> render(Hw09Web.CommentView, "show.html") end),
      responses: event.responses,
    }
    IO.inspect(result);
    result
  end

  def render("event.json", %{event: event}) do
    %{
      id: event.id,
      description: event.description,
      date: event.date,
      name: event.name,
    }
  end 
end
