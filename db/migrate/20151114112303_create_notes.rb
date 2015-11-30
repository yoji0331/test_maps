class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :name
      t.string :note_id
      t.float :lat
      t.float :lng

      t.timestamps null: false
    end
  end
end
