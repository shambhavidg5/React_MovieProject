
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import Header from '../../common/header/Header';
import './Details.css';


const Details = (props) => {
    
    const[movieData, setMovieData] = useState({
        genres: [],
        trailer_url: "",
        artists: []
        });

    useEffect(() => {
        let movieInfo = null;    
        fetch(props.baseUrl + "movies/" + props.match.params.id , {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            },
            body: movieInfo,
        })  
        .then((response) => response.json())
        .then((response) => {
            setMovieData(response);
        });
        }, []);

    const videoOptions = {
        height: '300',
        width: '700',
        playerVars: {
            autoplay: 1
        }
    }

    let initStarIcons = []
    for(let i = 1; i < 6; i++)
        initStarIcons.push({
            id: i,
            color: "black"
        }) 
    
    const [starIcons, setStarIcons] = useState(initStarIcons);

    const startClickHandler = (id) => {
        let starIconList = [];
        for (let star of starIcons) {
            let starNode = star;
            if (star.id <= id)
                starNode.color = "yellow"
            else
                starNode.color = "black";
            starIconList.push(starNode);
        }
        setStarIcons(starIconList);
    }

    const artistClickHandler = (url) => {
        window.location = url;
    }

    return(
        <div className="details">
            <Header id={props.match.params.id} baseUrl={props.baseUrl} showBookShowButton="true" />
            <div className="backToHome">
                <Typography>
                    <Link to="/">  &lt; Back to Home</Link>
                </Typography>
            </div>
            <div className="flex-containerDetails">
                <div className="leftPanel centerAlign">
                    <img src={movieData.poster_url} alt={movieData.title}/>
                </div>

                <div className="middlePanel">
                    <Typography variant="headline" component="h2">{movieData.title}</Typography>
                    <Typography>
                        <span className="bold">Genres: </span> {movieData.genres.join(",")}
                    </Typography>
                    <Typography><span className="bold">Duration:</span> {movieData.duration} </Typography>
                    <Typography><span className="bold">Release Date:</span> {new Date(movieData.release_date).toDateString()} </Typography>
                    <Typography><span className="bold"> Rating:</span> {movieData.critics_rating}  </Typography>
                    <div className="marginTop-16">
                        <Typography><span className="bold">Plot:</span> <a href={movieData.wiki_url}>(Wiki Link)</a> {movieData.storyline} </Typography>
                    </div>
                    <div className="trailer-Container">
                        <Typography> <span className="bold">Trailer:</span></Typography>
                        <YouTube
                            videoId={movieData.trailer_url.split("?v=")[1]}
                            opts={videoOptions}
                            onReady={props._onReady}
                        />
                    </div>
                </div>

                <div className="rightPanel">
                    <Typography><span className="bold">Rate this movie: </span></Typography>
                    {starIcons.map(star => (
                        <StarBorderIcon
                            className={star.color}
                            key={"star" + star.id}
                            onClick={() => startClickHandler(star.id)}
                        />
                    ))}
                    <div className="bold marginBottom-16 marginTop-16">
                        <Typography><span className="bold">Artists:</span></Typography>
                    </div>
                    <div className="paddingRight">
                        <GridList cellHeight={160} cols={2}>
                            {movieData.artists != null && movieData.artists.map(artist => (
                                <GridListTile
                                    className="grid-Tile"
                                    onClick={() => artistClickHandler(artist.wiki_url)}
                                    key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                    <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details;