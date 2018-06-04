var completions = [
  { name: 'Vue.js', language: 'JavaScript' },
  { name: 'Rails', language: 'Ruby' },
  { name: 'Sinatra', language: 'Ruby' },
  { name: 'Laravel', language: 'PHP' },
  { name: 'Phoenix', language: 'Elixir' }
]

var getCompletions = function (id) {
  return completions;
}

export default {
  completions,
  getCompletions
}
