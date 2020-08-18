Rails.application.routes.draw do
  root to: 'pages#home'
  post 'updateline', to: 'pages#create'
  mount ActionCable.server, at: '/cable'
end
