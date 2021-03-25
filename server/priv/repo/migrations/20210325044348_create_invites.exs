defmodule Hw09.Repo.Migrations.CreateInvites do
  use Ecto.Migration

  def change do
    create table(:invites) do
      add :response, :string, default: "unresponded"
      add :event_id, references(:events, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:invites, [:event_id, :user_id])
  end
end
