import { useEffect, useRef, useState } from "react";

const MUSIC_STATE_KEY = 'background_music_state';
const MUSIC_TOGGLE_EVENT = 'MUSIC_TOGGLE';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(MUSIC_STATE_KEY);
      return savedState ? JSON.parse(savedState) : true;
    }
    return false;
  });

  const audioRef = useRef(null);

  useEffect(() => {
    try {
      console.log('Initializing audio...');
      audioRef.current = new Audio('/assets/audio/background-music.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.muted = false;

      const handleToggle = () => {
        console.log('Toggle event received');
        setIsPlaying(prev => !prev);
      };

      window.toggleBackgroundMusic = handleToggle;

      document.addEventListener(MUSIC_TOGGLE_EVENT, handleToggle);

      return () => {
        document.removeEventListener(MUSIC_TOGGLE_EVENT, handleToggle);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        delete window.toggleBackgroundMusic;
      };
    } catch (error) {
      console.error('Setup error:', error);
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    console.log('isPlaying changed:', isPlaying);
    try {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('Play successful'))
            .catch(error => console.error('Play failed:', error));
        }
      } else {
        audioRef.current.pause();
      }
      localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(isPlaying));
    } catch (error) {
      console.error('Playback control error:', error);
    }
  }, [isPlaying]);

  return null;
};

export default BackgroundMusic;
