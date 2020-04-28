
console.log()


var playlist = WaveformPlaylist.init({
  samplesPerPixel: 5000,
  mono: true,
  waveHeight: 100,
  container: document.getElementById("myplaylist"),
  state: "cursor",
  colors: {
    waveOutlineColor: "#E0EFF1",
    timeColor: "grey",
    fadeColor: "black"
  },
  controls: {
    show: true,
    width: 200
  },
  zoomLevels: [500, 1000, 3000, 5000]
})

if(location.hash != ""){
    var prj = location.hash.replace("#",'')
    $.get( "audacity_projects/"+prj+".json", function( data ) {

        playlist
          .load(data)
          .then(function() {
            // can do stuff with the playlist.
          });
    });
}

$.get( "all_projects.json", function( data ) {
    for(var i in data){
        var prj = data[i];
        $('#header').append(
            '<li class=""><a href="'+prj.link+'">'+prj.name+' <span class="sr-only">(current)</span></a></li>'
        )
    }
})

window.onhashchange = function(e, a){
    console.log(e, a)
    location.reload()
}
