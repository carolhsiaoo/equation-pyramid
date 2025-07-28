// Global audio manager to ensure single instance of audio across pages
class AudioManager {
  private static instance: AudioManager;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isInitialized = false;
  private currentSrc: string | null = null;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  initBackgroundMusic(src: string, volume: number = 0.5, startTime: number = 0): HTMLAudioElement {
    // If already initialized with the same source, return existing instance
    if (this.backgroundMusic && this.isInitialized && this.currentSrc === src) {
      return this.backgroundMusic;
    }

    // Clean up existing instance if switching to a different source
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }

    // Create new audio instance
    this.backgroundMusic = new Audio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = volume;
    this.backgroundMusic.preload = "auto";
    this.currentSrc = src;
    
    if (startTime > 0) {
      this.backgroundMusic.addEventListener('loadedmetadata', () => {
        if (this.backgroundMusic) {
          this.backgroundMusic.currentTime = startTime;
        }
      }, { once: true });
    }

    this.isInitialized = true;
    return this.backgroundMusic;
  }

  getBackgroundMusic(): HTMLAudioElement | null {
    return this.backgroundMusic;
  }

  cleanup() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
      this.isInitialized = false;
    }
  }
}

export const audioManager = AudioManager.getInstance();