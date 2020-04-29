
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
}else{
    $('.playlist-toolbar').hide()
}

$.get( "all_projects.json", function( data ) {
    for(var i in data){
        var prj = data[i];
        var active = location.hash.replace('#', '') == prj.name ? 'active' : '';
        
        $('#header').append(
            '<li class="'+active+'"><a href="'+prj.link+'">'+prj.name+' <span class="sr-only">(current)</span></a></li>'
        )
    }
})

window.onhashchange = function(e, a){
    location.reload()
}

function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

var download_current_project = function(){
    var zip = new JSZip();
    var project_name = location.hash.replace('#', '');
    var url = location.pathname+'audacity_projects/'+project_name+'.aup';
    zip.file(project_name+'.aup', urlToPromise(url), {binary:true});
    
    $('header a').each(function(){
        var url = $(this).attr('href')
        var filename = url.replace(/.*\//g, "");
        var re = /\/(.*)_data\/.+\.ogg/g;
        var res = re.exec(url)
        var project_name = res[1]
        zip.file(project_name+'_data/'+filename, urlToPromise(url), {binary:true});
    })

    zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
    })
    .then(function callback(blob) {
        saveAs(blob, project_name+".zip");
    }, function (e) {
        showError(e);
    });
    
    
}
