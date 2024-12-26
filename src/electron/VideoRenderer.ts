import { spawn } from 'child_process';
// or however you're getting your canvas element from electron

interface VideoRendererOptions {
  inputVideoPath: string;
  outputPath: string;
  canvasWidth: number;
  canvasHeight: number;
  //fps: number;
}

interface Playable {
  play: () => void
  pause: () => void
  elapsedTime: number
}

class VideoRenderer {
    private ffmpegProcess: any;
    private canvas: any;

    constructor(options: VideoRendererOptions) {
        const ffmpegArgs = [
            // Input video
            '-i', options.inputVideoPath,
            // Canvas input format
            '-f', 'rawvideo',
            '-pix_fmt', 'rgba',
            '-s', `${options.canvasWidth}x${options.canvasHeight}`,
            //'-r', options.fps.toString(),
            '-i', '-', // Read canvas stream from stdin
            // Overlay filter
            '-filter_complex', `[0:v][1:v]overlay=0:H-h[out]`,
            // Output settings
            '-map', '[out]',
            '-map', '0:a',
            '-c:a', 'copy',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            options.outputPath
        ];

        this.ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

        // Handle errors
        this.ffmpegProcess.stderr.on('data', (data: Buffer) => {
            console.log('FFmpeg stderr:', data.toString());
        });

        this.ffmpegProcess.on('close', (code: number) => {
            console.log('FFmpeg process closed with code:', code);
        });
    }

    // Method to send a canvas frame to FFmpeg
    public writeFrame(canvas: any) {
        const imageData = canvas.getContext('2d')!.getImageData(
            0, 0, 
            canvas.width, canvas.height
        );
        
        this.ffmpegProcess.stdin.write(Buffer.from(imageData.data));
    }

    // Clean up
    public end() {
      this.ffmpegProcess.stdin.end();
    }

    public processVideo(playable: {}) {

    }
}

// Usage example:
/*
async function processVideo() {
    const options: FFmpegStreamOptions = {
        inputVideoPath: 'input.mp4',
        outputPath: 'output.mp4',
        canvasWidth: 800,  // your sheet music canvas width
        canvasHeight: 200, // your sheet music canvas height
        fps: 30,
        videoWidth: 1920,
        videoHeight: 1080
    };

    const streamer = new VideoRenderer(options);

    // Assuming you have some way to get the current timestamp
    // and update your sheet music canvas accordingly
    let currentTime = 0;
    const duration = 60; // video duration in seconds

    while (currentTime < duration) {
        // Update your OSMD cursor and render to canvas
        // This is just an example - replace with your actual rendering logic
        updateSheetMusicCanvas(currentTime);
        
        // Send the frame to FFmpeg
        streamer.writeFrame(yourCanvas);

        currentTime += 1/options.fps;
        // You might want to add some timing logic here to maintain proper FPS
    }

    streamer.end();
}

function updateSheetMusicCanvas(time: number) {
    // Your logic to update OSMD cursor and render to canvas
    // This would include:
    // - Moving the cursor
    // - Rendering the sheet music
    // - Any other animations
}
    */