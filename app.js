var http=require("http");
var mysql=require("mysql");
var express=require('express');
var fs=require('fs');
var bodyParser=require('body-parser');
var app=express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(express.bodyParser());
console.log('Creating the http server');
//var urlencodedParser = bodyParser.urlencoded({ extended: true });
var con= mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "musicdb"
});
con.connect(function(err){
    if(err)
	{
	  console.log('Errror connecting to db');
	  return;
	}
	console.log('Connection established');
});
var track_statement;
var artist_statement;
var album_statement;
var genre_statement;
var music_query;
app.get('/',function(request,response)
{
	fs.readFile('file.html',function(err,data)
	{
		console.log("The home page: file.html");
        response.end(data);
	});
});
app.post('/',function(request,response)
{
	console.log("hi");
	music_query=request.body.music_query;
	music_query=music_query.split(":");
	console.log(music_query);
	if(music_query.includes("artist"))
	{
		//music_query=music_query.substr(music_query.indexOf("play"),music_query.length-1);
		console.log(music_query[1]);
		artist_statement="select artists.name AS 'Artists',tracks.track_name AS 'Track_Name', albums.name AS 'Album', genres.name AS 'Genre'"+
		" from "+
		"tracks,albums,artists,genres "+
		"where tracks.album_id= albums.id "+
		"and "+
		"tracks.genre_id=genres.id "+
		"and "+
		"tracks.artist_id=artists.id";
		if(music_query[1].includes("artists")===false)
		{	
	       artist_statement=artist_statement+" and artists.name like '%"+music_query[1]+"%'";
		   console.log(artist_statement);
        }
		if(music_query[1].includes("artists")===true)
		{
			artist_statement="select artists.name AS 'Artists',tracks.track_name AS 'Track_Name', albums.name AS 'Album', genres.name AS 'Genre'"+
				" from "+
				"tracks,albums,artists,genres "+
				"where tracks.album_id= albums.id "+
				"and "+
				"tracks.genre_id=genres.id "+
				"and "+
				"tracks.artist_id=artists.id order by Artists";
			console.log(artist_statement);	
		}
        fs.readFile('file.html',function(err,data)
		{
		   con.query(artist_statement,function(err,results, fields)
		   {
			   if(err) throw err;
			//console.log('Data received from DB: \n');
			//console.log(rows);
			var output="<html><head><meta charset='utf-8'>"+
			           "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>"+
					   "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>"+
					   "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script></head>"+
						"<body background='/music_background.gif'style='margin-top:5%; margin-left:10%; margin-right:10%;'><div id='table_container'><h1 align='center' style='color:white;'>Tracks of Artist "+music_query[1]+"</h1>"+
						"<ul><table border=1 id='tableID' class='table table-striped'><tr>";
			for (var index=0;index<fields.length;index++)
			{
				output += "<td style='background-color:#0c323d;color:white;'><b>" + fields[index].name + '</b></td>';
			}
			output += '</tr>';
			for (var index in results)
			{
				output += "<tbody><tr><td>" + results[index].Artists + '</td>';
				output += '<td>' + results[index].Track_Name + '</td>';
				output += '<td>' + results[index].Album + '</td>';
				output += '<td>' + results[index].Genre + '</td></tr></tbody>';
				//output += "<td id='location' style='display:none'>"+ results[index].Play +'</td></tr></tbody>';
			
			}
			output += '</ul>'+
			'</div>'+
			"<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';
			response.writeHeader(200, {'Content-Type': 'text/html'});
			response.write(data);
			response.end(output);
		   });
		});   
	}
	if(music_query.includes("albums"))
	{
		//music_query=music_query.substr(music_query.indexOf("play"),music_query.length-1);
		console.log(music_query[1]);
		album_statement="select albums.name AS 'Albums',artists.name AS 'Artist',tracks.track_name AS 'Track_Name',genres.name AS 'Genre'"+
		" from "+
		"tracks,albums,artists,genres "+
		"where tracks.album_id= albums.id "+
		"and "+
		"tracks.genre_id=genres.id "+
		"and "+
		"tracks.artist_id=artists.id";
		if(music_query[1].includes("albums")===false)
		{	
	       album_statement=album_statement+" and albums.name like '%"+music_query[1]+"%'";
		   console.log(album_statement);
        }
		if(music_query[1].includes("albums")===true)
		{
			album_statement="select albums.name AS 'Albums',artists.name AS 'Artist',tracks.track_name AS 'Track_Name',genres.name AS 'Genre'"+
				" from "+
				"tracks,albums,artists,genres "+
				"where tracks.album_id= albums.id "+
				"and "+
				"tracks.genre_id=genres.id "+
				"and "+
				"tracks.artist_id=artists.id order by Albums";
			console.log(album_statement);	
		}
        fs.readFile('file.html',function(err,data)
		{
		   con.query(album_statement,function(err,results, fields)
		   {
			   if(err) throw err;
			//console.log('Data received from DB: \n');
			//console.log(rows);
			var output="<html><head><meta charset='utf-8'>"+
			           "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>"+
					   "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>"+
					   "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script></head>"+
						"<body style='margin-top:5%; margin-left:10%; margin-right:10%;' background='/music_background.gif'><div id='table_container'><h1 align='center' style='color:white;'>Tracks of Album "+music_query[1]+"</h1>"+
						"<ul><table border=1 id='tableID' class='table table-striped'><tr>";
			for (var index=0;index<fields.length;index++)
			{
				output += "<td style='background-color:#0c323d;color:white;'><b>" + fields[index].name + '</b></td>';
			}
			output += '</tr>';
			for (var index in results)
			{
				output += "<tbody><tr><td>" + results[index].Albums + '</td>';
				output += '<td>' + results[index].Artist + '</td>';
				output += '<td>' + results[index].Track_Name + '</td>';
				output += '<td>' + results[index].Genre + '</td></tr></tbody>';
				//output += "<td id='location' style='display:none'>"+ results[index].Play +'</td></tr></tbody>';
			
			}
			output += '</ul>'+
			'</div>'+
			"<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';
			response.writeHeader(200, {'Content-Type': 'text/html'});
			response.write(data);
			response.end(output);
		   });
		});   
	}
	if(music_query.includes("genre"))
	{
		//music_query=music_query.substr(music_query.indexOf("play"),music_query.length-1);
		console.log(music_query[1]);
		genre_statement="select genres.name AS 'Genres',tracks.track_name AS 'Track_Name',artists.name AS 'Artist',albums.name AS 'Album'"+
		" from "+
		"tracks,albums,artists,genres "+
		"where tracks.album_id= albums.id "+
		"and "+
		"tracks.genre_id=genres.id "+
		"and "+
		"tracks.artist_id=artists.id";
		if(music_query[1].includes("genres")===false)
		{	
	       genre_statement=genre_statement+" and genres.name like '%"+music_query[1]+"%'";
		   console.log(genre_statement);
        }
		if(music_query[1].includes("genres")===true)
		{
			genre_statement="select genres.name AS 'Genres',tracks.track_name AS 'Track_Name',albums.name AS 'Album',artists.name AS 'Artist'"+
				" from "+
				"tracks,albums,artists,genres "+
				"where tracks.album_id= albums.id "+
				"and "+
				"tracks.genre_id=genres.id "+
				"and "+
				"tracks.artist_id=artists.id order by Genres";
			console.log(genre_statement);	
		}
        fs.readFile('file.html',function(err,data)
		{
		   con.query(genre_statement,function(err,results, fields)
		   {
			   if(err) throw err;
			//console.log('Data received from DB: \n');
			//console.log(rows);
			var output="<html><head><meta charset='utf-8'>"+
			           "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>"+
					   "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>"+
					   "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script></head>"+
						"<body style='margin-top:5%; margin-left:10%; margin-right:10%;' background='/music_background.gif'><div id='table_container'><h1 align='center' style='color:white;'>Tracks of Genre "+music_query[1]+"</h1>"+
						"<ul><table border=1 id='tableID' class='table table-striped'><tr>";
			for (var index=0;index<fields.length;index++)
			{
				output += "<td style='background-color:#0c323d;color:white;'><b>" + fields[index].name + '</b></td>';
			}
			output += '</tr>';
			for (var index in results)
			{
				output += "<tbody><tr><td>" + results[index].Genres + '</td>';
				output += "<td>" + results[index].Track_Name + '</td>';
				output += '<td>' + results[index].Album + '</td>';
				output += '<td>' + results[index].Artist+ '</td></tr></tbody>';
				//output += "<td id='location' style='display:none'>"+ results[index].Play +'</td></tr></tbody>';
			
			}
			output += '</ul>'+
			'</div>'+
			"<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';
			response.writeHeader(200, {'Content-Type': 'text/html'});
			response.write(data);
			response.end(output);
		   });
		});   
	}
	if(music_query[0].includes("track"))
    {
        //music_query=music_query.substr(music_query.lastIndexOf("song")+5);
		console.log(music_query[1]);
		if(music_query[1].includes("tracks")===false)
		{	
		  track_statement="select location,file_format from tracks where track_name like '%"+music_query[1]+"%'";
	      fs.readFile('file.html',function(err,data)
	      { 
		//con.query(track_statement+music_query+"%'",function(err,results, fields)
		    con.query(track_statement,function(err,results, fields)
		    {
			  if(err) throw err;
			  var output="<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head>"+
			  "<body background='/music_background.gif' align='center' style='margin-top:5%;'><ul><table border=1 style='margin:100px;display:none' id='tableID'><tr>";
			  for (var index=0;index<fields.length;index++)
			  {
				output += '<td><b>' + fields[index].name + '</b></td>';
			  }
			  output += '</tr>';
			  for (var index in results)                                 // results array is giving rows from db 
			  {
				var x  = results[index];
				output += "<tbody style='cursor:pointer'><tr><td id='location'>" + results[index].location + '</td>';
				output += "<td>"+results[index].file_format+"</td></tr></tbody>";
				console.log(results[index].location);
			  }
			  if(results[0].file_format==='audio/mp3')
			  {	  
			    output += '</ul>'+
			    "<div id='audioContainer'>"+
				"<div id='track_gif'>"+
			    "<img src='/track_background.gif' width=600px' height=500px'></div>"+ 
			    "<audio id='audio' style='width:600px;' controls='controls' autoplay>"+
			    "<source id='mp3source' src='"+results[0].location+"' type='audio/mp3'>"+
			    '</audio>'+
				"<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';+				
			    '</div></body></html>';
			  }
              else
			  {
			    output += '</ul>'+
			    "<div id='videoContainer'>"+
			    "<video id='video' controls='controls' autoplay>"+
			    "<source id='mp4source' src='"+results[0].location+"' type='video/mp4'>"+
			    '</video>'+
				'</div>'+
			    "<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';+
			    '</body></html>';  
              }				  
			  response.writeHeader(200, {'Content-Type': 'text/html'});
			  response.write(data);
			  response.end(output);			
		    });
	      });
		}
        if(music_query[1].includes("tracks")===true)
		{
		   track_statement="select tracks.track_name AS 'Track_Name',genres.name AS 'Genres',albums.name AS 'Album',artists.name AS 'Artist'"+
				" from "+
				"tracks,albums,artists,genres "+
				"where tracks.album_id= albums.id "+
				"and "+
				"tracks.genre_id=genres.id "+
				"and "+
				"tracks.artist_id=artists.id order by Track_Name";
			console.log(track_statement);
			fs.readFile('file.html',function(err,data)
			{
				con.query(track_statement,function(err,results, fields)
		        {
					if(err) throw err;
					//console.log('Data received from DB: \n');
					//console.log(rows);
					var output="<html><head><meta charset='utf-8'>"+
			           "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>"+
					   "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>"+
					   "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script></head>"+
						"<body style='margin-top:5%; margin-left:10%; margin-right:10%;' background='/music_background.gif'><div id='table_container'><h1 align='center' style='color:white;'>Displaying current tracks</h1>"+
						"<ul><table border=1 id='tableID' class='table table-striped'><tr>";
					for (var index=0;index<fields.length;index++)
					{
						output += "<td style='background-color:#0c323d;color:white;'><b>" + fields[index].name + '</b></td>';
					}
					output += '</tr>';
					for (var index in results)
					{
						output += "<tbody><tr><td>" + results[index].Track_Name + '</td>';
						output += "<td>" + results[index].Genres + '</td>';
						output += '<td>' + results[index].Album + '</td>';
						output += '<td>' + results[index].Artist+ '</td></tr></tbody>';
						//output += "<td id='location' style='display:none'>"+ results[index].Play +'</td></tr></tbody>';
					}
					output += '</ul>'+
					'</div>'+
					"<script>document.getElementById('speech').placeholder='Say help if you get stuck';"+'</script></body></html>';
					response.writeHeader(200, {'Content-Type': 'text/html'});
					response.write(data);
					response.end(output);
				});
			});   
        }	
	}
 });
http.createServer(app).listen(8090,"127.0.0.1");