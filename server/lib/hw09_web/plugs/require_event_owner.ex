defmodule Hw09Web.Plugs.RequireEventOwner do 
    import Plug.Conn
    alias Hw09Web.Helpers
    
    def init(args), do: args

    def call(conn, _args) do
        IO.inspect(conn.assigns)
        if Helpers.is_owner?(conn, conn.assigns[:event].id) do
            conn
        else 
            conn 
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(401, Jason.encode!(%{"error" => "You doesn't own this event!"}))
            |> halt()
        end 
    end 
end 