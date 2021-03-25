defmodule Hw09Web.PageController do
  use Hw09Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
