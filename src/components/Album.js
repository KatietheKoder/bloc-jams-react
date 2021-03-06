import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import Ionicon from 'react-ionicons';
import style from './Album.css'

  class Album extends Component {
  constructor(props) {
       super(props);

       const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug

     });

       this.state = {
       album: album,
       currentSong: album.songs[0],
       currentTime: 0,
       volume: 0.8,
       duration: album.songs[0].duration,
       isPlaying: false,
       isHovered: null,
       };
        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
     }

     controlButton(song, index) {
       if (song === this.state.currentSong & this.state.isPlaying){
         return <ion-icon name="pause"></ion-icon>
       }
       else if (song === this.state.isHovered) {
         return <ion-icon name="play"></ion-icon>
       }
       else {
         return index + 1
       }
     }

     play() {
          this.audioElement.play();
          this.setState({ isPlaying: true });
        }

     pause() {
      this.audioElement.pause();
      this.setState({ isPlaying: false });
    }

    onHover (song) {
      this.setState({ isHovered: song });
    }

    offHover (song) {
      this.setState({ isHovered: null });
    }

  componentDidMount() {
      this.eventListeners = {
   timeupdate: e => {
     this.setState({ currentTime: this.audioElement.currentTime });
   },
   durationchange: e => {
     this.setState({ duration: this.audioElement.duration });
   }
 };
 this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
 this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
       }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
       }

   setSong(song) {
        console.log(song);
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song, isPlaying:
       (this.state.isPlaying ? false : true)
        });
        console.log(this.state.isPlaying);
      }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();
      }
    }

    handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    console.log(e.target.value);
    this.audioElement.volume = e.target.value;
    this.setState({ volume: e.target.value });
  }

 formatTime (seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = seconds % 60;
  if (seconds < 10) {
  return minutes + ":" + 0 + Math.floor(seconds);
  }

  else {
 return minutes + ":" + Math.floor(seconds);
   }
}

     render() {
       return (
         <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
          <h1 id="album-title">{this.state.album.title}</h1>
          <h2 className="artist">{this.state.album.artist}</h2>
          <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
        <span>
        </span>
        <span>
         <colgroup>
           <col id="song-number-column" />
           <col id="song-title-column" />
           <col id="song-duration-column" />
         </colgroup>
         </span>
         <tbody>

         {
           this.state.album.songs.map((song, index) => {
          return <tr className="song" key={index} onClick={() => this.handleSongClick(song)}>
          <td onMouseEnter={() => this.onHover(song)} onMouseLeave={() => this.offHover(song)}> {this.controlButton(song, index)} </td>
          <td> {song.title}</td>
          <td> {this.formatTime(song.duration)}</td>
       </tr>
            })
           }
         </tbody>
       </table>
       <PlayerBar
           formatTime = {this.formatTime}
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           volume={this.state.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
     </section>
     )

   }
 }



export default Album;
