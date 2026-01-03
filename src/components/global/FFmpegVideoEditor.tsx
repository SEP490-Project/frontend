import React, { useState, useEffect, useRef, useMemo } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import {
  Play,
  Scissors,
  Crop,
  Monitor,
  Smartphone,
  Square,
  Volume2,
  Zap,
  RotateCcw,
  Loader2,
  Sun,
  RotateCw,
  Film,
  Download,
  Wand2,
  Layers,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/libs/utils";
import { ProgressIndicator } from "@radix-ui/react-progress";

interface AdvancedVideoEditorProps {
  file: File;
  onSave: (processedFile: File) => void;
  onCancel: () => void;
}

type AspectRatio = "original" | "9:16" | "16:9" | "1:1" | "4:5";
type ExportFormat = "mp4" | "gif";

const FFmpegVideoEditor = ({ file, onSave, onCancel }: AdvancedVideoEditorProps) => {
  // --- Engine State ---
  const [loaded, setLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- Media State ---
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Editor Parameters ---
  const [activeTab, setActiveTab] = useState("trim");
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("original");
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [brightness, setBrightness] = useState(0); // -1.0 to 1.0
  const [contrast, setContrast] = useState(1); // 0 to 2.0
  const [saturation, setSaturation] = useState(1); // 0 to 3.0
  const [exportFormat, setExportFormat] = useState<ExportFormat>("mp4");
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [targetResolution, setTargetResolution] = useState("original"); // "original", "1080p", "720p"

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = `${window.location.origin}/ffmpeg`;

    try {
      if (!ffmpeg.loaded) {
        ffmpeg.on("progress", ({ progress }) => {
          setProgress(Math.round(progress * 100));
        });

        await ffmpeg.load({
          coreURL: `${baseURL}/ffmpeg-core.js`,
          wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        });
      }
      setLoaded(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load video engine.");
    }
  };

  // --- Initialization ---
  useEffect(() => {
    loadFFmpeg();
  }, []);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setTrimRange([0, 0]);
    setIsPlaying(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // --- Handlers ---
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const dur = e.currentTarget.duration;
    setDuration(dur);
    if (trimRange[1] === 0) setTrimRange([0, dur]);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    if (trimRange[1] > 0 && time >= trimRange[1]) {
      videoRef.current.currentTime = trimRange[0];
      if (isPlaying) videoRef.current.play();
    }
  };

  const resetAll = () => {
    setTrimRange([0, duration]);
    setSelectedRatio("original");
    setVolume(100);
    setSpeed(1);
    setRotation(0);
    setBrightness(0);
    setContrast(1);
    setSaturation(1);
    setFadeIn(false);
    setFadeOut(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = 1;
      videoRef.current.volume = 1;
    }
  };

  const handleCancelProcessing = async () => {
    try {
      // 1. Terminate the active worker (Stops CPU usage immediately)
      ffmpegRef.current.terminate();

      // 2. Reset UI State
      setIsProcessing(false);
      setProgress(0);
      toast.info("Export cancelled", { duration: 2000 });

      // 3. Re-instantiate Engine (Required because terminate kills the instance)
      setLoaded(false); // Show loader briefly
      ffmpegRef.current = new FFmpeg(); // Create fresh instance
      await loadFFmpeg(); // Reload core files
    } catch (error) {
      console.error("Error cancelling:", error);
    }
  };

  // --- Processing Logic ---
  const processVideo = async () => {
    // 1. SAFEGUARD: Validate Trim Duration
    // If metadata didn't load or range is invalid, fallback to full video duration
    const currentDuration = duration || videoRef.current?.duration || 0;
    let [start, end] = trimRange;

    if (end <= start || end === 0) {
      start = 0;
      end = currentDuration || 10; // Fallback to 10s if absolutely no duration found to prevent error
    }

    const trimDuration = end - start;
    if (trimDuration <= 0.1) {
      toast.error("Video duration is too short.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;

    videoRef.current?.pause();
    setIsPlaying(false);

    try {
      const inputName = "input.mp4";
      const outputName = `output.${exportFormat}`;

      // Write file to memory
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const filters: string[] = [];

      // --- A. Video Filters ---

      // 1. Color Correction
      if (brightness !== 0 || contrast !== 1 || saturation !== 1) {
        filters.push(`eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`);
      }

      // 2. Rotation
      if (rotation === 90) filters.push("transpose=1");
      if (rotation === 180) filters.push("transpose=1,transpose=1");
      if (rotation === 270) filters.push("transpose=2");

      // 3. Crop (Safe Even Dimensions for H.264)
      if (selectedRatio !== "original") {
        const ratioMap: Record<string, string> = {
          "9:16": "crop=trunc(ih*9/16/2)*2:ih:(iw-ow)/2:0",
          "16:9": "crop=iw:trunc(iw*9/16/2)*2:0:(ih-oh)/2",
          "1:1": "crop=trunc(min(iw,ih)/2)*2:trunc(min(iw,ih)/2)*2:(iw-ow)/2:(ih-oh)/2",
          "4:5": "crop=trunc(ih*4/5/2)*2:ih:(iw-ow)/2:0",
        };
        filters.push(ratioMap[selectedRatio]);
      }

      // 4. Resolution (Scaling)
      if (targetResolution === "1080p") filters.push("scale=-2:1080");
      if (targetResolution === "720p") filters.push("scale=-2:720");
      if (targetResolution === "480p") filters.push("scale=-2:480");

      // 5. Speed
      if (speed !== 1) {
        filters.push(`setpts=(PTS-STARTPTS)/${speed}`);
      } else {
        filters.push("setpts=PTS-STARTPTS"); // Reset PTS is crucial after input seeking
      }

      // 6. Fades
      const activeDuration = trimDuration / speed;
      if (fadeIn) filters.push("fade=t=in:st=0:d=1");
      if (fadeOut) {
        const startFade = Math.max(0, activeDuration - 1);
        filters.push(`fade=t=out:st=${startFade}:d=1`);
      }

      // --- B. Audio Filters ---
      const audioFilters: string[] = [];
      audioFilters.push("asetpts=PTS-STARTPTS"); // Sync audio with video

      if (volume !== 100) audioFilters.push(`volume=${volume / 100}`);
      if (speed !== 1) audioFilters.push(`atempo=${speed}`);

      if (fadeIn) audioFilters.push("afade=t=in:st=0:d=1");
      if (fadeOut) {
        const startFade = Math.max(0, activeDuration - 1);
        audioFilters.push(`afade=t=out:st=${startFade}:d=1`);
      }

      // --- C. Command Construction ---
      const command = [];

      // INPUT SEEKING: Put -ss BEFORE -i
      // This is faster and prevents black frames at the start
      command.push("-ss", start.toString());
      command.push("-t", trimDuration.toString());
      command.push("-i", inputName);

      // Apply Filters
      if (filters.length > 0) command.push("-vf", filters.join(","));

      if (exportFormat !== "gif") {
        if (audioFilters.length > 0) command.push("-af", audioFilters.join(","));
        command.push("-c:a", "aac"); // Force AAC Audio
        command.push("-ar", "44100"); // Standardize sample rate (fixes audio glitches)
        command.push("-ac", "2"); // Force Stereo (fixes mono issues)
      }

      // Video Codec & Flags
      if (exportFormat === "gif") {
        command.push("-f", "gif", "-loop", "0", "-s", "320x-1");
      } else {
        command.push(
          "-c:v",
          "libx264", // Codec
          "-preset",
          "ultrafast", // Speed
          "-pix_fmt",
          "yuv420p", // CRITICAL: Browser compatibility color space
          "-movflags",
          "+faststart", // CRITICAL: Moves metadata to start of file for browser playback
        );
      }

      command.push(outputName);

      // Execute & Check Exit Code
      const ret = await ffmpeg.exec(command);
      if (ret !== 0) {
        throw new Error("FFmpeg execution failed");
      }

      // Read Output
      const data = await ffmpeg.readFile(outputName);

      // Double check data validity
      if (data.length === 0) {
        throw new Error("Output file is empty");
      }

      const mimeType = exportFormat === "gif" ? "image/gif" : "video/mp4";
      const processedFile = new File(
        [data],
        `edited_${file.name.replace(/\.[^/.]+$/, "")}.${exportFormat}`,
        { type: mimeType },
      );

      onSave(processedFile);
    } catch (error) {
      if (isProcessing) {
        console.error("FFmpeg Error:", error);
        toast.error("Export failed. Please try a simpler edit.", { duration: 5000 });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Visual Transforms (CSS for Preview) ---
  const previewStyle = useMemo(() => {
    return {
      filter: `brightness(${1 + brightness}) contrast(${contrast}) saturate(${saturation})`,
      transform: `rotate(${rotation}deg) scale(${
        rotation % 180 !== 0
          ? (videoRef.current?.videoHeight || 1) / (videoRef.current?.videoWidth || 1)
          : 1
      })`,
      transition: "all 0.3s ease",
    };
  }, [brightness, contrast, saturation, rotation]);

  if (!loaded) {
    return (
      <div className="h-[600px] w-full flex flex-col items-center justify-center bg-zinc-950 text-white rounded-xl border border-zinc-800">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500 mb-4" />
        <p className="text-zinc-400">Loading Video Engine...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh] max-h-[900px] bg-zinc-950 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 text-zinc-100 font-sans">
      {/* 1. Header */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-pink-500" />
          <span className="font-semibold text-sm">Studio Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <div className="h-4 w-[1px] bg-zinc-700 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={processVideo}
            disabled={isProcessing}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isProcessing ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* 2. Tools Sidebar */}
        <div className="w-16 md:w-20 border-r border-zinc-800 bg-zinc-900 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
          <ToolTabButton
            icon={<Scissors />}
            label="Trim"
            active={activeTab === "trim"}
            onClick={() => setActiveTab("trim")}
          />
          <ToolTabButton
            icon={<Crop />}
            label="Crop"
            active={activeTab === "crop"}
            onClick={() => setActiveTab("crop")}
          />
          <ToolTabButton
            icon={<Wand2 />}
            label="Adjust"
            active={activeTab === "adjust"}
            onClick={() => setActiveTab("adjust")}
          />
          <ToolTabButton
            icon={<Volume2 />}
            label="Audio"
            active={activeTab === "audio"}
            onClick={() => setActiveTab("audio")}
          />
          <ToolTabButton
            icon={<Zap />}
            label="Speed"
            active={activeTab === "speed"}
            onClick={() => setActiveTab("speed")}
          />
          <ToolTabButton
            icon={<Layers />}
            label="Effects"
            active={activeTab === "effects"}
            onClick={() => setActiveTab("effects")}
          />
        </div>

        {/* 3. Main Preview Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-black relative">
          {/* Video Container */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden p-8">
            <div
              className={cn(
                "relative transition-all duration-300 shadow-2xl",
                // Simulate aspect ratio crop via container shape if needed,
                // but usually simpler to mask via overflow for preview
                selectedRatio === "original" ? "w-full h-full" : "w-auto h-auto",
              )}
              style={{
                aspectRatio:
                  selectedRatio === "original" ? "auto" : selectedRatio.replace(":", "/"),
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            >
              <video
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-contain bg-black/20"
                style={previewStyle}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                muted={volume === 0}
              />

              {/* Play Overlay */}
              {!isPlaying && !isProcessing && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 group hover:bg-black/20 transition-all"
                >
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </button>
              )}
            </div>

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-6 text-center">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">Exporting Video...</h3>
                    <p className="text-zinc-400 text-sm">
                      Please wait while we process your edits.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-zinc-400 text-xs font-mono">
                      <span>PROGRESS</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-zinc-800">
                      <ProgressIndicator className="bg-pink-600 transition-all duration-300" />
                    </Progress>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleCancelProcessing}
                    className="border-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-950/50 hover:border-red-800 transition-colors w-full"
                  >
                    <Ban className="w-4 h-4 mr-2" /> Cancel Export
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Bottom Controls Panel (Context Sensitive) */}
          <div className="h-[220px] bg-zinc-900 border-t border-zinc-800 p-6 flex flex-col shrink-0">
            {/* Context Title */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium capitalize flex items-center gap-2">
                {activeTab === "trim" && <Scissors className="w-4 h-4 text-pink-500" />}
                {activeTab === "crop" && <Crop className="w-4 h-4 text-pink-500" />}
                {activeTab === "adjust" && <Wand2 className="w-4 h-4 text-pink-500" />}
                {activeTab === "audio" && <Volume2 className="w-4 h-4 text-pink-500" />}
                {activeTab === "speed" && <Zap className="w-4 h-4 text-pink-500" />}
                {activeTab === "effects" && <Layers className="w-4 h-4 text-pink-500" />}
                {activeTab} Tool
              </h3>

              {/* Global Time Display */}
              <div className="text-sm font-mono bg-zinc-950 px-3 py-1 rounded border border-zinc-800 text-zinc-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex-1">
              {activeTab === "trim" && (
                <div className="space-y-4 pt-2">
                  <Slider
                    value={trimRange}
                    min={0}
                    max={duration}
                    step={0.1}
                    minStepsBetweenThumbs={1}
                    onValueChange={(val) => {
                      setTrimRange(val as [number, number]);
                      if (videoRef.current) videoRef.current.currentTime = val[0];
                    }}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 font-mono">
                    <span>Start: {trimRange[0].toFixed(1)}s</span>
                    <span>Duration: {(trimRange[1] - trimRange[0]).toFixed(1)}s</span>
                    <span>End: {trimRange[1].toFixed(1)}s</span>
                  </div>
                </div>
              )}

              {activeTab === "crop" && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <CropOption
                      label="Original"
                      ratio="original"
                      current={selectedRatio}
                      onClick={setSelectedRatio}
                      icon={<Monitor className="w-4 h-4" />}
                    />
                    <CropOption
                      label="9:16 TikTok"
                      ratio="9:16"
                      current={selectedRatio}
                      onClick={setSelectedRatio}
                      icon={<Smartphone className="w-4 h-4" />}
                    />
                    <CropOption
                      label="16:9 YouTube"
                      ratio="16:9"
                      current={selectedRatio}
                      onClick={setSelectedRatio}
                      icon={<Monitor className="w-4 h-4" />}
                    />
                    <CropOption
                      label="1:1 Square"
                      ratio="1:1"
                      current={selectedRatio}
                      onClick={setSelectedRatio}
                      icon={<Square className="w-4 h-4" />}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <Label className="text-xs text-zinc-400">Rotate:</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      <RotateCw className="w-3 h-3 mr-2" /> {rotation}°
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "adjust" && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="flex items-center gap-2">
                        <Sun className="w-3 h-3" /> Brightness
                      </Label>
                      <span className="text-xs text-zinc-500">{brightness.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[brightness]}
                      min={-0.5}
                      max={0.5}
                      step={0.05}
                      onValueChange={([v]) => setBrightness(v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-current" /> Contrast
                      </Label>
                      <span className="text-xs text-zinc-500">{contrast.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[contrast]}
                      min={0.5}
                      max={1.5}
                      step={0.05}
                      onValueChange={([v]) => setContrast(v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-blue-500 rounded-sm" />{" "}
                        Saturation
                      </Label>
                      <span className="text-xs text-zinc-500">{saturation.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[saturation]}
                      min={0}
                      max={2}
                      step={0.1}
                      onValueChange={([v]) => setSaturation(v)}
                    />
                  </div>

                  {/* Export Format Selector */}
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select
                      value={exportFormat}
                      onValueChange={(v: ExportFormat) => setExportFormat(v)}
                    >
                      <SelectTrigger className="h-8 bg-zinc-950 border-zinc-700">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4 Video</SelectItem>
                        <SelectItem value="gif">Animated GIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeTab === "audio" && (
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between mb-2">
                    <Label>Master Volume</Label>
                    <span className="text-xs text-zinc-500">{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={200}
                    step={1}
                    onValueChange={([v]) => {
                      setVolume(v);
                      if (videoRef.current) videoRef.current.volume = Math.min(v / 100, 1);
                    }}
                  />
                  <p className="text-xs text-zinc-500">Boost volume up to 200% or mute entirely.</p>
                </div>
              )}

              {activeTab === "speed" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2.0].map((rate) => (
                      <Button
                        key={rate}
                        variant={speed === rate ? "default" : "outline"}
                        onClick={() => {
                          setSpeed(rate);
                          if (videoRef.current) videoRef.current.playbackRate = rate;
                        }}
                        className={cn(
                          "flex-1 border-zinc-700 hover:bg-zinc-800 hover:text-white",
                          speed === rate &&
                            "bg-pink-600 hover:bg-pink-700 text-white border-pink-600",
                        )}
                      >
                        {rate}x
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    Note: Audio pitch will be corrected automatically.
                  </p>
                </div>
              )}

              {activeTab === "effects" && (
                <div className="space-y-6 max-w-md">
                  <div className="space-y-4">
                    <Label className="text-base">Transitions</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={fadeIn ? "default" : "outline"}
                        onClick={() => setFadeIn(!fadeIn)}
                        className={cn("flex-1", fadeIn && "bg-pink-600 hover:bg-pink-700")}
                      >
                        Fade In (1s)
                      </Button>
                      <Button
                        variant={fadeOut ? "default" : "outline"}
                        onClick={() => setFadeOut(!fadeOut)}
                        className={cn("flex-1", fadeOut && "bg-pink-600 hover:bg-pink-700")}
                      >
                        Fade Out (1s)
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500">Applies to both Video and Audio</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <Label className="text-base">Compression (Quality)</Label>
                    <Select value={targetResolution} onValueChange={setTargetResolution}>
                      <SelectTrigger className="bg-zinc-950 border-zinc-700">
                        <SelectValue placeholder="Resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original Quality</SelectItem>
                        <SelectItem value="1080p">1080p HD</SelectItem>
                        <SelectItem value="720p">720p (Social Media)</SelectItem>
                        <SelectItem value="480p">480p (Email/Small)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const ToolTabButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 w-full py-3 transition-colors",
      active
        ? "text-pink-500 bg-pink-500/10 border-r-2 border-pink-500"
        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
    )}
  >
    {/* Cast to ReactElement so TS knows it accepts props */}
    {React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: "w-5 h-5",
        })
      : icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const CropOption = ({ label, ratio, current, onClick, icon }: any) => (
  <Button
    variant="outline"
    onClick={() => onClick(ratio)}
    className={cn(
      "flex-1 h-20 flex flex-col gap-2 border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white text-zinc-400",
      current === ratio && "border-pink-500 text-pink-500 bg-pink-500/5 hover:bg-pink-500/10",
    )}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, "0")}.${ms}`;
};

export default FFmpegVideoEditor;
