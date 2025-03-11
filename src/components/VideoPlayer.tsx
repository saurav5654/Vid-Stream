
import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, Settings
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  let controlsTimeout: NodeJS.Timeout;

  // Simulated data and functions since we're using the YouTube iframe API
  useEffect(() => {
    if (isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  const handleProgressChange = (newValue: number[]) => {
    const newProgress = newValue[0];
    const newTime = (duration * newProgress) / 100;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const showControls = () => {
    setIsControlsVisible(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  useEffect(() => {
    showControls();
    
    // Set initial duration (this would come from the actual YouTube API)
    setDuration(420); // 7 minutes
    
    return () => {
      clearTimeout(controlsTimeout);
    };
  }, []);

  return (
    <div 
      ref={playerContainerRef}
      className="relative w-full overflow-hidden bg-black rounded-lg aspect-video"
      onMouseMove={showControls}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {/* YouTube iFrame */}
      <iframe
        ref={videoRef}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&rel=0&modestbranding=1`}
        allowFullScreen
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      
      {/* Custom Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity",
          isControlsVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <div className="absolute bottom-12 left-0 right-0 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white">{formatTime(currentTime)}</span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="cursor-pointer"
              onValueChange={handleProgressChange}
            />
            <span className="text-xs text-white">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <SkipBack size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <SkipForward size={20} />
            </Button>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsVolumeControlVisible(true)}
              onMouseLeave={() => setIsVolumeControlVisible(false)}
            >
              <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <div 
                className={cn(
                  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-youtube-card rounded-full p-2 transition-opacity",
                  isVolumeControlVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <Slider
                  orientation="vertical"
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="h-24"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
