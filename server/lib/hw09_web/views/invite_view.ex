defmodule Hw09Web.InviteView do
  use Hw09Web, :view
  alias Hw09Web.InviteView
  alias Hw09.Invites

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "invite.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    invite = Invites.load_user(invite)

    %{
      id: invite.id,
      response: invite.response,
      user: render_one(invite.user, Hw09Web.UserView, "user.json"),
    }
  end
end 
