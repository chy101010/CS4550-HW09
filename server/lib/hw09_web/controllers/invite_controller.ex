defmodule Hw09Web.InviteController do
  use Hw09Web, :controller

  alias Hw09.Invites
  alias Hw09.Invites.Invite
  alias Hw09.Events
  alias Hw09.Users

  alias Hw09Web.Plugs
  plug Plugs.RequireAuth when action in [:create, :update, :delete]
  # User must fully Register to use the site
  plug Plugs.RequireRegistration when action in [:create, :update, :delete]
  # Fetch invite to @conn 
  plug :fetch_invite when action in [:show, :update, :delete]
    # Fetch event to @conn 
  plug :fetch_event when action in [:update, :show, :delete]
  # Require Event Owner 
  plug Plugs.RequireEventOwner when action in [:delete]

  action_fallback Hw09Web.FallbackController

  # Fetch the event associated to the current invite
  def fetch_event(conn, _params) do
    event = Events.get_event!(conn.assigns[:invite].event_id)
    assign(conn, :event, event)
  end

  # Fetch the invite 
  def fetch_invite(conn, _params) do
    id = conn.params["id"]
    invite = Invites.get_invite!(id)
    assign(conn, :invite, invite)
  end 

  def create_helper(conn, invite_params) do
    case Invites.create_invite(invite_params) do
      {:ok, invite} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
        |> render("invite.json", invite: invite)
      {:error, %Ecto.Changeset{} = _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Invitation Failed"}))
    end 
  end 

  # Access: Event Owner 
  def create(conn, invite_params) do
    event_id = invite_params["event_id"]
    event = Events.get_event!(event_id)
    if(String.length(String.trim(event_id)) == 0) do
      conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Event Not Found!"}))
    else
      {email , invite_params} = Map.pop(invite_params, "email")
      if(is_owner?(conn, event_id) && conn.assigns[:user].email != email) do
        invitee = Users.get_user_by_email(email)
        if(!invitee) do
          {result, user} = Users.create_user(%{"email" => email, "password" => "0123456789"})
          if(result == :error) do
            conn
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(406, Jason.encode!(%{error: "Something Went Wrong, Email Format?"}))
          else
            invite_params = Map.put(invite_params, "user_id", user.id)
            create_helper(conn, invite_params)
          end
        else 
            invite_params = Map.put(invite_params, "user_id", invitee.id)
            create_helper(conn, invite_params)
        end
      else 
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(406, Jason.encode!(%{error: "Why are you trying to invite yourself???"}))
      end 
    end  
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  # Access: Invitess
  def update(conn, %{"id" => id, "invite" => invite_params}) do
    user_id = conn.assigns[:user].id
    invite = conn.assigns[:invite]
    event = conn.assigns[:event]
    if(user_id == invite.user_id) do
      case Invites.update_invite(invite, invite_params) do
        {:ok, invite} ->
          conn
          |> put_status(:accepted)
          |> render("show.json", invite: invite)
        {:error, %Ecto.Changeset{} = changeset} -> 
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(406, Jason.encode!(%{error: "Failed Update"}))
      end 
    else 
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Not Yours!"}))
    end 
  end

  # Require owner of the event
  def delete(conn, %{"id" => id}) do
    user_id = conn.assigns[:user].id
    event = conn.assigns[:event]
    if(event && event.user_id == user_id) do
      invite = conn.assigns[:invite]
      
      with {:ok, %Invite{}} <- Invites.delete_invite(invite) do
        send_resp(conn, :no_content, "")
      end
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "No Access!"}))
    end 
  end
end
