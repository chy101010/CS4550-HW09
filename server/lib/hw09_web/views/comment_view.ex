defmodule Hw09Web.CommentView do
  use Hw09Web, :view
  alias Hw09Web.CommentView
  alias Hw09.Comments

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    comment = 
    comment
    |> Comments.load_user()
    |> Comments.load_event()

    result = %{id: comment.id,
      body: comment.body,
      user: render_one(comment.user, Hw09Web.UserView, "user.json"),
      event: render_one(comment.event, Hw09Web.EventView, "event.json"),
    }
    result
  end
end
