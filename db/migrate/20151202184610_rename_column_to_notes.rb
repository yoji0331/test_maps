class RenameColumnToNotes < ActiveRecord::Migration
	def change
		rename_column :notes, :mi1, :mi01
		rename_column :notes, :mi2, :mi02
		rename_column :notes, :mi3, :mi03
		rename_column :notes, :mi4, :mi04
		rename_column :notes, :mi5, :mi05
		rename_column :notes, :mi6, :mi06
		rename_column :notes, :mi7, :mi07
		rename_column :notes, :mi8, :mi08
		rename_column :notes, :mi9, :mi09
	end
end