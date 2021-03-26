defmodule Hw09Web.UserController do
  use Hw09Web, :controller

  alias Hw09.Users
  alias Hw09.Users.User
  alias Hw09Web.Plugs

  plug Plugs.RequireAuth when action in [:show, :update]
  plug :require_owner when action in [:show, :update]

  action_fallback Hw09Web.FallbackController
 
  def require_owner(conn, _params) do
    id = conn.params["id"]
    if(conn.assigns[:user].id == String.to_integer(id)) do
      conn
    else
      conn
      |> put_flash(:error, "No Access")
      |> redirect(to: Routes.page_path(conn, :index))
    end 
  end 

  def create(conn, %{"user" => user_params}) do
    case Users.create_user(user_params) do 
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed Registration"}))
    end 
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end
end
