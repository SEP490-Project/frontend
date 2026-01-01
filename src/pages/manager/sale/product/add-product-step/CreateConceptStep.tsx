import React, { useCallback, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useOutletContext, type NavigateFunction } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createConceptSchema } from "@/libs/validation/conceptValidation";
import { useChunkUpload } from "@/libs/hooks/useChunkUpload";
import { useAppDispatch } from "@/libs/stores";
import { createConceptThunk } from "@/libs/stores/conceptManager/thunk";
import manageProduct from "@/libs/services/manageProduct";
import { getItem, setItem } from "@/libs/local-storage";
import { toast } from "sonner";
import { Upload, X, Scissors, Loader2 } from "lucide-react";
import type { CreateConceptPayload } from "@/libs/types/concept";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { useAuth } from "@/libs/hooks/useAuth";
import FFmpegVideoEditor from "@/components/global/FFmpegVideoEditor";

export const CreateConceptStep = () => {
  const { setOnSubmitStep, steps, currentStep, navigate, state, isDisabled, setIsDisabled } =
    useOutletContext<{
      setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
      steps: { path: string; label: string }[];
      currentStep: number;
      navigate: NavigateFunction;
      state: any;
      isDisabled: boolean;
      setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    }>();

  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // Upload hooks
  const { uploadFileInChunks, progress, isUploading } = useChunkUpload();

  // Video State
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);

  // Banner State
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    control,
  } = useForm<CreateConceptPayload>({
    resolver: yupResolver(createConceptSchema),
    defaultValues: {
      name: "",
      description: "",
      banner_url: "",
      video_thumbnail: "",
    },
  });

  const [name, description, banner_url, video_thumbnail] = watch([
    "name",
    "description",
    "banner_url",
    "video_thumbnail",
  ]);

  // Load saved data
  useEffect(() => {
    const savedConcept = getItem<CreateConceptPayload>("currentConcept");
    if (savedConcept) {
      reset(savedConcept);

      // Handle Banner Previews
      if (savedConcept.banner_url) {
        const urls = Array.isArray(savedConcept.banner_url)
          ? savedConcept.banner_url
          : [savedConcept.banner_url];

        if (String(savedConcept.banner_url).includes(",")) {
          const splitUrls = String(savedConcept.banner_url).split(",");
          setBannerPreviews(splitUrls);
        } else {
          setBannerPreviews(urls);
        }
      }

      // Handle Video Preview
      if (savedConcept.video_thumbnail) {
        setVideoPreview(savedConcept.video_thumbnail);
      }
    }
  }, [reset]);

  // Validation Logic
  useEffect(() => {
    const isFormValid = Boolean(
      name &&
        name.trim() !== "" &&
        description &&
        description.trim() !== "" &&
        banner_url &&
        !errors.name &&
        !errors.description &&
        !errors.banner_url,
    );

    // Valid if we have a remote URL OR a local file ready to upload
    const isVideoValid = Boolean(video_thumbnail || localFile);

    const shouldBeDisabled = !(isFormValid && isVideoValid);

    // Only update if value actually changed to prevent render loops
    if (isDisabled !== shouldBeDisabled) {
      setIsDisabled(shouldBeDisabled);
    }
  }, [
    name,
    description,
    banner_url,
    video_thumbnail,
    localFile,
    errors,
    setIsDisabled,
    isDisabled,
  ]);

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file size must be less than 100MB");
      return;
    }

    setLocalFile(file);

    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setValue("video_thumbnail", "");
  };

  const handleEditorSave = (editedFile: File) => {
    setLocalFile(editedFile);

    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }

    const newUrl = URL.createObjectURL(editedFile);
    setVideoPreview(newUrl);
    setShowAdvancedEditor(false);
  };

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setLocalFile(null);
    setValue("video_thumbnail", "");
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploadingBanner(true);
    try {
      toast.info(`Uploading ${validFiles.length} image(s)...`);

      const response = await dispatch(
        uploadFilesThunk({ userId: user?.id || "", files: validFiles }),
      ).unwrap();

      if (response && Object.keys(response).length > 0) {
        const uploadedUrls = Object.values(response).flat();
        const newBannerUrls = [...bannerPreviews, ...uploadedUrls];
        setBannerPreviews(newBannerUrls);
        setValue(
          "banner_url",
          newBannerUrls.length === 1 ? newBannerUrls[0] : newBannerUrls.join(","),
        );
        toast.success(`${validFiles.length} image(s) uploaded successfully!`);
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Banner upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleRemoveBanner = (index: number) => {
    const newPreviews = bannerPreviews.filter((_, i) => i !== index);
    setBannerPreviews(newPreviews);
    setValue("banner_url", newPreviews.length === 1 ? newPreviews[0] : newPreviews.join(","));
  };

  const onSubmit = useCallback(
    async (payload: CreateConceptPayload) => {
      try {
        const existingConcept = getItem("currentConcept");
        // If we have a saved concept and no new local file, proceed without upload
        if (existingConcept && !localFile) {
          navigate(steps[currentStep]?.path, { state });
          return;
        }

        setIsDisabled(true);

        let finalVideoUrl = payload.video_thumbnail;

        // Step A: Upload Video if local file exists
        if (localFile) {
          try {
            const response = await uploadFileInChunks(localFile);
            if (response && response.data && response.data.HostURL) {
              finalVideoUrl = response.data.HostURL;
            } else {
              throw new Error("Invalid upload response");
            }
          } catch (uploadError) {
            console.error("Video upload failed:", uploadError);
            toast.error("Video upload failed. Please try again.");
            setIsDisabled(false);
            return;
          }
        }

        if (!finalVideoUrl) {
          toast.error("Missing video content");
          setIsDisabled(false);
          return;
        }

        // Step B: Create Concept API
        const finalPayload = { ...payload, video_thumbnail: finalVideoUrl };

        const result = await dispatch(createConceptThunk(finalPayload)).unwrap();
        if (result) {
          setItem("currentConcept", finalPayload);

          const existingProduct = getItem<{ data: { id: string } }>("currentProduct");
          if (existingProduct?.data?.id) {
            try {
              await manageProduct.addConceptToLimitedProduct(existingProduct.data.id, result.id);
              toast.success("Concept created and linked to product successfully");
            } catch (linkError) {
              console.error("Failed to link concept to product:", linkError);
              toast.warning("Concept created but failed to link to product");
            }
          } else {
            toast.success("Concept created successfully");
          }

          setLocalFile(null);
          navigate(steps[currentStep]?.path, { state });
        }
      } catch (error: any) {
        toast.error(error || "Failed to create concept");
      } finally {
        setIsDisabled(false);
      }
    },
    [dispatch, navigate, steps, currentStep, state, setIsDisabled, localFile, uploadFileInChunks],
  );

  const onError = useCallback((errors: any) => {
    const firstError = errors[Object.keys(errors)[0]];
    toast.error(firstError?.message || "Please fill in all required fields");
  }, []);

  // --- FIX FOR MAX UPDATE DEPTH LOOP ---
  // 1. Create a stable ref to hold the current form submission logic
  const submitHandlerRef = useRef<() => Promise<void>>(async () => {});

  // 2. Update the ref whenever the form data or handlers change (this is safe/fast)
  useEffect(() => {
    submitHandlerRef.current = handleSubmit(onSubmit, onError);
  }, [handleSubmit, onSubmit, onError]);

  // 3. Set the context submit handler ONLY ONCE (or if setOnSubmitStep reference changes)
  // Inside the function, we access the *current* ref value.
  useEffect(() => {
    if (setOnSubmitStep) {
      setOnSubmitStep(() => async () => {
        // Always execute the latest version of the handler
        if (submitHandlerRef.current) {
          await submitHandlerRef.current();
        }
      });
    }
  }, [setOnSubmitStep]);

  return (
    <div className="space-y-6 mb-12 mt-6">
      {/* Loading Overlay */}
      {(isUploading || isUploadingBanner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-full">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-md">
            {isUploading ? (
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            ) : (
              <Upload className="w-12 h-12 animate-pulse text-primary" />
            )}
            <p className="text-lg font-semibold">
              {isUploading ? "Uploading video & Saving..." : "Uploading images..."}
            </p>
            {isUploading && progress > 0 && (
              <div className="w-full min-w-[200px]">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600 text-center mt-2">{progress}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Editor Fullscreen Dialog */}
      <Dialog open={showAdvancedEditor} onOpenChange={setShowAdvancedEditor}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-transparent border-none shadow-none [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Video Editor</DialogTitle>
          </DialogHeader>
          {localFile && (
            <FFmpegVideoEditor
              file={localFile}
              onSave={handleEditorSave}
              onCancel={() => setShowAdvancedEditor(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Concept Information</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="col-span-2 space-y-4">
              {/* Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="conceptName"
                  className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end"
                >
                  <span className="text-red-600 mr-1">*</span>
                  Concept Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="conceptName"
                      placeholder="Enter concept name"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 col-start-2 col-span-3">{errors.name.message}</p>
              )}

              {/* Description */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end"
                >
                  <span className="text-red-600 mr-1">*</span>
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter concept description"
                  className="col-span-3 min-h-[100px]"
                  {...register("description")}
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-600 col-start-2 col-span-3">
                  {errors.description.message}
                </p>
              )}

              {/* Banner Upload */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Label
                  htmlFor="banner"
                  className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end"
                >
                  <span className="text-red-600 mr-1">*</span>
                  Banner Images
                </Label>
                <div className="col-span-3 space-y-4">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    multiple
                    onChange={handleBannerUpload}
                    className="hidden"
                    disabled={isUploadingBanner}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("banner-upload")?.click()}
                    disabled={isUploadingBanner}
                  >
                    {isUploadingBanner ? "Uploading..." : "Choose Images"}
                  </Button>

                  {bannerPreviews.length > 0 && (
                    <div className="lg:inline text-sm text-gray-600 ml-2">
                      {bannerPreviews.length} image(s) uploaded
                    </div>
                  )}

                  {/* Banner Preview Grid */}
                  {bannerPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {bannerPreviews.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveBanner(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Video) */}
            <div className="col-span-2">
              <div className="space-y-2">
                <Label className="block mb-2">
                  <span className="text-red-600 mr-1">*</span>
                  Video
                </Label>

                {!videoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Upload concept video file (Max 100MB)</p>
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("video-upload")?.click()}
                      disabled={isUploading}
                    >
                      Choose Video
                    </Button>
                  </div>
                ) : (
                  <div className="relative group">
                    <video
                      key={videoPreview}
                      src={videoPreview}
                      controls
                      className="w-full max-h-[400px] object-contain rounded-lg bg-black"
                    />

                    {/* Control Bar Overlay */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {localFile && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAdvancedEditor(true)}
                          className="text-black bg-white/90 hover:bg-white"
                        >
                          <Scissors className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveVideo}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {localFile ? (
                          <span className="text-green-600 font-medium">
                            Ready to upload: {localFile.name}
                          </span>
                        ) : (
                          <span>Current video loaded</span>
                        )}
                      </div>

                      {!isUploading && (
                        <div className="space-x-2">
                          <input
                            type="file"
                            id="video-replace"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("video-replace")?.click()}
                          >
                            Replace Video
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
