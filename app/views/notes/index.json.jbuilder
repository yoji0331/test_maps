json.array!(@notes) do |note|
  json.extract! note, :id, :name, :note_id, :lat, :lng
  json.url note_url(note, format: :json)
end
