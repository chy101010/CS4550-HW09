defmodule Hw09Web.SessionController do
    use Hw09Web, :controller

    # Starter Code From Lecture
    def create(conn, %{"email" => email, "password" => password}) do
        #  TODO: Password Auth
        user = Hw09.Users.authenticate(email, password);
        if(user) do 
            sess = %{
                user_id: user.id,
                name: user.name,
                token: Phoenix.Token.sign(conn, "user_id", user.id),
            }
            conn
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(:created, Jason.encode!(%{session: sess}))
        else
            conn
            |> put_resp_header("content-type", "application/json; charset=UTF-8")
            |> send_resp(:unauthorized, Jason.encode!(%{error: "Login Failed"}))
        end 
    end
end
