defmodule Hw09Web.CommentController do
  use Hw09Web, :controller

  alias Hw09.Comments
  alias Hw09.Comments.Comment

  alias Hw09Web.Plugs

  plug Plugs.RequireAuth when action in [:create, :update, :delete, :show]
  # User must fully Register to use the site
  plug Plugs.RequireRegistration when action in [:create, :update, :delete]
  # Fetch comment to @conn 
  plug :fetch_comment when action in [:show, :update, :delete]
  # Only Commenter and Owner can edit/update/delete a comment
  plug :require_commenter_access when action in [:update, :delete]

  action_fallback Hw09Web.FallbackController

  def fetch_comment(conn, _arg) do
    id = conn.params["id"]
    comment = Comments.get_comment!(id)
    assign(conn, :comment, comment)
  end 

  def require_commenter_access(conn, _arg) do
    id = conn.params["id"]
    if(is_commenter?(conn, id)) do
      conn 
    else 
      conn
      |> put_flash(:error, "No access")
      |> redirect(to: Routes.page_path(conn, :index))
      |> halt()
    end 
  end 

  # Access: Event owner and invitees
  def create(conn, %{"comment" => comment_params}) do
    event_id = comment_params["event_id"]
    cond do 
      !event_id ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Select a event!"}))
      belong_to_event?(conn, event_id) ->
        case Comments.create_comment(comment_params) do
          {:ok, comment} ->
            conn
            |> put_status(:created)
            |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
            |> render("show.json", comment: comment)
          {:error, %Ecto.Changeset{} = _changeset} ->
            conn
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(406, Jason.encode!(%{error: "Failed Update"}))
        end
      true ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unauthorized, Jason.encode!(%{error: "No Access"}))
    end 
  end

  def show(conn, %{"id" => id}) do
    comment = conn.assigns[:comment]
    event_id = comment.event_id;
    if(belong_to_event?(conn, event_id)) do
      render(conn, "show.json", comment: comment)
    else 
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Not Authorized!"}))
    end 
  end

  # Access: Event Owner and Invitee who created the comment
  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = conn.assigns[:comment]
    event = conn.assigns[:event]
    case Comments.update_comment(comment, comment_params) do
      {:ok, comment} ->
        render(conn, "show.json", comment: comment)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unauthorized, Jason.encode!(%{error: "Failed Creation"}))
    end 
  end

  # Access: Event Owner and Invitee who created the comment 
  def delete(conn, %{"id" => id}) do
    comment = conn.assigns[:comment]
    with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
