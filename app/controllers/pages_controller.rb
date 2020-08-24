class PagesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def home
    @lines = Line.last(1000).to_json
  end

  def create
    line = Line.new(line_params)
    if line.save
      ActionCable.server.broadcast 'drawing_channel',
      fromx: line.from_x,
      fromy: line.from_y,
      tox: line.to_x,
      toy: line.to_y,
      strokeColour: line.colour,
      lineWidth: line.width,
      opType: line.op_type
    end
  end

  def line_params
    params.permit(:from_x, :from_y, :to_x, :to_y, :colour, :width, :op_type)
  end
end
