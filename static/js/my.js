var pokemon_names = []
var pokedex
var team = [{}, {}, {}, {}, {}, {}]
var teamIndex = 0

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

function remove_pokemon(el) {
  if (teamIndex > 0) {
    var i = 0, itr = el
    while(itr.previousElementSibling !== null) {
      i += 1
      itr = itr.previousElementSibling
    }
    team.splice(i, 1)
    team.push({})
    create_cards()
    el.remove()
    teamIndex -= 1
    document.querySelector("#add-pokemon").style.display = "block"
  }
}

function add_pokemon(e) {
  const pokemon_form = document.querySelector("div.pokemon-form")
  teamIndex += 1
  if (teamIndex < 6) {
    const form = pokemon_form.cloneNode(true)
    form.querySelectorAll("input").forEach((item, i) => {
      item.value = ""
    })
    form.querySelector("img").setAttribute("src", "https://user-images.githubusercontent.com/13006910/76887468-64de6880-6893-11ea-8712-d9b69391ee85.png")
    const name_input = form.querySelector("input#name-input")
    typeahead(form)
    form.querySelector(".del").addEventListener("click", () => remove_pokemon(form))
    e.target.before(form)
  }
  if (teamIndex >= 5) {
    teamIndex = 5
    document.querySelector("#add-pokemon").style.display = "none"
  }
}

function select_pokemon(name, formIndex) {
  const form = document.querySelectorAll(".pokemon-form")[formIndex]
  const i = pokemon_names.indexOf(name)
  image_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other-sprites/official-artwork/"+pokedex[i].entry_number+".png"

  form.querySelector("#name-input").value = name
  form.querySelector("#pokemon-img").setAttribute("src", image_url)

  team[formIndex] = {name: name, dex_url: pokedex[i].pokemon_species.url, image: image_url}
  create_cards()
}

function onNameChange(e, form) {
  listDOM = form.querySelector("div#name-list")
  input = e.target.value
  filtered_list = pokemon_names.filter(name => name.toLowerCase().indexOf(input.toLowerCase()) === 0)
  var html = ""
  html += "<ul>\n"
  var formIndex = 0
  while(form.previousElementSibling !== null) {
    formIndex += 1
    form = form.previousElementSibling
  }
  filtered_list.forEach((name, i) => {
    html += "<li id=name-"+i+" onclick=\"select_pokemon('"+name+"',"+formIndex+")\">"+ name +"</li>\n"
  })
  html += "</ul>\n"
  listDOM.innerHTML = html
  listDOM.style.display = "block"
}

// Run now

get_pokedex()

// Pokemon typeahead
function typeahead(form) {
  const name_input = form.querySelector("input#name-input")
  const wrapper = document.createElement('span')
  const name_list = document.createElement('div')
  name_list.setAttribute('id', 'name-list')
  name_input.parentNode.insertBefore(wrapper, name_input)
  wrapper.appendChild(name_input)
  wrapper.appendChild(name_list)

  name_input.addEventListener("input", (e) => {
    if (e.target.value.length > 0)
      onNameChange(e, form)
    else {
      name_list.style.display = "none"
    }
  })
  name_input.addEventListener("focusout", () => {
    setTimeout(() => name_list.style.display = "none", 200)
  })

  name_input.addEventListener("focus", () => name_list.style.display = "block")
}
// end of section

const preview = document.querySelector("#preview")

function create_card(pokemon) {
  console.log(pokemon)
  const card = document.createElement("div")
  card.setAttribute("class", "col")
  const image = document.createElement("img")
  image.setAttribute("src", pokemon.image)
  image.setAttribute("width", "100")
  card.appendChild(image)

  preview.appendChild(card)
}
function create_cards() {
  // clear preview
  while(preview.lastChild != null) {
    preview.lastChild.remove()
  }
  team.forEach((pokemon, i) => {
    if(pokemon.hasOwnProperty('name')) create_card(pokemon)
  })
}

typeahead(document.querySelector(".pokemon-form"))
var first_form = document.querySelector(".pokemon-form")
first_form.querySelector(".del")
          .addEventListener("click", () => remove_pokemon(first_form))
