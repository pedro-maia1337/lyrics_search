const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const url = 'https://api.lyrics.ovh'

const fecthSongs = async term => {
    const response = await fetch(`${url}/suggest/${term}`)
    const data = await response.json()

    showSongs(data)  
}

const fetchLyrics = async (artist, songTitle) => {
    const response = await fetch(`${url}/v1/${artist}/${songTitle}`)
    const data = await response.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '</br>')

    songsContainer.innerHTML = `
    <li class="lyrics-conteiner">
        <h2><strong>${songTitle}</strong> - ${artist}</h2>
        <p class="lyrics">${lyrics}</p>
    </li>
    `
}


const getMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`) //resolvendo cors
    const data = await response.json()

    showSongs(data) 
}

const showSongs = (songList) => {
    songsContainer.innerHTML = songList.data.map(songs => `
    <li class="song">
        <span class="song-artist"><strong>${songs.artist.name}</strong> - ${songs.title}</span>
        <button class="btn" data-artist="${songs.artist.name}" data-song-title="${songs.title}">Ver Letra</button>
    </li>
    `).join(' ')

    if(songList.prev || songList.next){
        prevAndNextContainer.innerHTML = `
            ${songList.prev ? `<button class="btn" onClick="getMoreSongs('${songList.prev}')">Anteriores</button>`:''}
            ${songList.next ? `<button class="btn" onClick="getMoreSongs('${songList.next}')">Próximas</button>`:''}
           
        `
        return
    }

    prevAndNextContainer = ''
}

form.addEventListener('submit', e => {
    e.preventDefault()

    const searchInputValue = searchInput.value.trim()

    if(!searchInputValue){
        songsContainer.innerHTML = `<li class="warning-message">Por favor, insira um termo válido</li>`
        return
    }

    fecthSongs(searchInputValue)
})

songsContainer.addEventListener('click', e => {
    const elementClicked = e.target

    if(elementClicked.tagName === 'BUTTON'){
        const artist = elementClicked.getAttribute('data-artist')
        const SongTitle = elementClicked.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist, SongTitle)
    }
})



