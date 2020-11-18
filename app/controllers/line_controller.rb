class LineController < ApplicationController
  def show

  ActionCable.server.broadcast 'lines',
    fromx: params[:fromx],
    fromy: params[:fromy],
    tox: params[:tox],
    toy: params[:toy],
    color: params[:color]
  head :ok

  end
end
