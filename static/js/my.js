var pokemon_names = []
var pokdex;

function get_pokedex() {
  fetch("https://pokeapi.co/api/v2/pokedex/1").then((response) => {
    if (response.status != 200) { /* handle problem */ }

    response.json().then(data => {
      pokedex = data.pokemon_entries
      pokedex.forEach((entry, i) => {
        pokemon_names.push(entry.pokemon_species.name.replace(/^\w/, c => c.toUpperCase()))
      })
    })
  })
}

function select_pokemon(name) {
  const i = pokemon_names.indexOf(name)
  console.log(pokedex[i])
  image_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other-sprites/official-artwork/"+pokedex[i].entry_number+".png"

  document.getElementById("name-input").value = name
  document.getElementById("pokemon-img").setAttribute("src", image_url)
}

function onNameChange(e, listDOM) {
  input = e.target.value
  filtered_list = pokemon_names.filter(name => name.toLowerCase().indexOf(input.toLowerCase()) === 0)
  var html = ""
  html += "<ul>\n"
  filtered_list.forEach((name, i) => {
    html += "<li id=name-"+i+" onclick=\"select_pokemon('"+name+"')\">"+ name +"</li>\n"
  })
  html += "</ul>\n"
  listDOM.innerHTML = html
  listDOM.style.display = "block"
}

// Run now

get_pokedex()

// Pokemon typeahead
const name_input = document.querySelector("input#name-input")

const wrapper = document.createElement('span')
const name_list = document.createElement('div')
name_list.setAttribute('id', 'name-list')
name_input.parentNode.insertBefore(wrapper, name_input)
wrapper.appendChild(name_input)
wrapper.appendChild(name_list)

name_input.addEventListener("input", (e) => {
  if (e.target.value.length > 0)
    onNameChange(e, name_list)
  else {
    name_list.style.display = "none"
  }
})
name_input.addEventListener("focusout", () => {
  setTimeout(() => name_list.style.display = "none", 200)
})

name_input.addEventListener("focus", () => name_list.style.display = "block")
// end of section
