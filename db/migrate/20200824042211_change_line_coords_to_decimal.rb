class ChangeLineCoordsToDecimal < ActiveRecord::Migration[6.0]
  def change
    change_column :lines, :from_x, :decimal, precision: 5, scale: 4
    change_column :lines, :from_y, :decimal, precision: 5, scale: 4
    change_column :lines, :to_x, :decimal, precision: 5, scale: 4
    change_column :lines, :to_y, :decimal, precision: 5, scale: 4
  end
end
