class RemoveColumnFromNotes < ActiveRecord::Migration
	def change
		remove_column :notes, :note_id
	end
end