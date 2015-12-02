json.array!(@notes) do |note|
  json.extract! note, :id, :name, :lat, :lng
  json.url note_url(note, format: :json)
end
