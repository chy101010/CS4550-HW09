defmodule Hw09Web.EventView do
  use Hw09Web, :view
  alias Hw09Web.EventView
   alias Hw09.Events

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("show_preload.json", %{event: event}) do
    %{data: render_one(event, EventView, "preload_event.json")}
  end 

  def render("preload_event.json", %{event: event}) do
    result = %{id: event.id,
      description: event.description,
      date: event.date,
      name: event.name,
      invites: render_many(event.invites, Hw09Web.InviteView, "invite.json"),
      comments: render_many(event.comments, Hw09Web.CommentView, "comment.json"),
      user: render_one(event.user, Hw09Web.UserView, "user.json"),
      responses: event.responses,
    }
    result
  end

  def render("event.json", %{event: event}) do
    event = Events.load_user(event);
    %{
      id: event.id,
      description: event.description,
      date: event.date,
      name: event.name,
      user: render_one(event.user, Hw09Web.UserView, "user.json")
    }
  end 
end
