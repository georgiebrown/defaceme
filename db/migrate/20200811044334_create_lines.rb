class CreateLines < ActiveRecord::Migration[6.0]
  def change
    create_table :lines do |t|
      t.integer :from_x
      t.integer :from_y
      t.integer :to_x
      t.integer :to_y
      t.string :colour

      t.timestamps
    end
  end
end
