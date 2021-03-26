defmodule Hw09Web.Plugs.RequireRegistration do 
    import Plug.Conn
    
    def init(args), do: args

    def call(conn, _args) do
        if conn.assigns[:user].name != nil do
            conn
        else 
            conn 
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Complete Registration By Getting A Name!"}))
            |> halt()
        end 
    end 
end 