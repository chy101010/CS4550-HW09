alias Hw07.Events
alias Hw07.Invites
alias Hw07.Comments
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
end 