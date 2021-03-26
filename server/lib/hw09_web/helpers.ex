alias Hw09.Events
alias Hw09.Invites
alias Hw09.Comments
defmodule Hw09Web.Helpers do
    # Owner of the event?
    def is_owner?(conn, event_id) do
        user_id = conn.assigns[:user].id
        event = Events.get_event!(event_id)
        user_id == event.user_id
    end

    # Count Responses
    def count_response(invites) do
        result =
        Enum.reduce(invites, %{"yes" => 0, "no" => 0, "maybe" => 0, "unresponded" => 0},  
        fn inv, acc -> 
            case inv.response do
                "yes" -> Map.put(acc, "yes", acc["yes"] + 1)
                "no" ->  Map.put(acc, "no", acc["no"] + 1) 
                "maybe" -> Map.put(acc, "maybe", acc["maybe"] + 1)
                "unresponded" -> Map.put(acc, "unresponded", acc["unresponded"] + 1)
            end
        end)
    end 

    # Invitee of the event?
    def is_invitee?(conn, event_id) do
        user_id = conn.assigns[:user].id
        event_id
        |> Events.get_event!()
        |> Events.load_invite()
        |> Map.get(:invites)
        |> Enum.any?(fn x -> x.user_id == user_id end)
    end


    # Commenter or Event Owner of the event? 
    def is_commenter?(conn, comm_id) do
        user_id = conn.assigns[:user].id
        comm = Comments.get_comment!(comm_id) 
        comm.user_id == user_id || is_owner?(conn, comm.event_id)
    end  

    # Check whehter it is a owner of an invitee of a event
    def belong_to_event?(conn, event_id) do
        is_owner?(conn, event_id) || is_invitee?(conn, event_id)
    end 
end 