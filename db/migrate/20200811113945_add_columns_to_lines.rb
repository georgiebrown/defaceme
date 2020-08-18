class AddColumnsToLines < ActiveRecord::Migration[6.0]
  def change
    add_column :lines, :width, :int
    add_column :lines, :op_type, :string
  end
end
