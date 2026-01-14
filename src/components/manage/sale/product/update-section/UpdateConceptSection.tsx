import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/libs/stores";
import { createConceptThunk } from "@/libs/stores/conceptManager/thunk";
import { createConceptSchema } from "@/libs/validation/conceptValidation";
import type { CreateConceptPayload, ConceptData } from "@/libs/types/concept";
import { useChunkUpload } from "@/libs/hooks/useChunkUpload";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { useAuth } from "@/libs/hooks/useAuth";
import { toast } from "sonner";
import { Upload, Trash2, Video, Plus, X, Scissors, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import manageConcept from "@/libs/services/manageConcept";
import manageProduct from "@/libs/services/manageProduct";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import FFmpegVideoEditor from "@/components/global/FFmpegVideoEditor";

interface UpdateConceptSectionProps {
  conceptId?: string;
  productId: string;
  onConceptUpdated?: () => void;
}

const UpdateConceptSection = ({
  conceptId,
  productId,
  onConceptUpdated,
}: UpdateConceptSectionProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { uploadFileInChunks, progress, isUploading } = useChunkUpload();
  const { productDetail } = useSelector((state: RootState) => state.manageProduct);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);

  // Video State
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Banner State
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const [currentConcept, setCurrentConcept] = useState<ConceptData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasConcept = Boolean(conceptId || (productDetail?.data as any)?.concept);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
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

  // Fetch concept details if conceptId exists
  useEffect(() => {
    const fetchConceptDetails = async () => {
      const concept = (productDetail?.data as any)?.concept;
      if (concept) {
        setCurrentConcept(concept);

        // Parse banner URLs
        if (concept.banner_url) {
          const urls =
            typeof concept.banner_url === "string"
              ? concept.banner_url.split(",").filter(Boolean)
              : Array.isArray(concept.banner_url)
                ? concept.banner_url
                : [];
          setBannerPreviews(urls);
        }

        if (concept.video_thumbnail) {
          setVideoPreview(concept.video_thumbnail);
        }
      }
    };

    fetchConceptDetails();
  }, [conceptId, productDetail]);

  // --- Handlers ---

  // 1. File Selection (No Upload Yet)
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

    // Revoke old URL if it was a blob
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    // Clear the form value for now, we will fill it on submit
    setValue("video_thumbnail", "");
  };

  // 2. Editor Save
  const handleEditorSave = (editedFile: File) => {
    setLocalFile(editedFile);

    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }

    const newUrl = URL.createObjectURL(editedFile);
    setVideoPreview(newUrl);
    setShowAdvancedEditor(false);
  };

  // 3. Remove Video
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
        const uploadedUrls = Object.values(response).flat() as string[];
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

  const handleDeleteConcept = async () => {
    if (!currentConcept?.id) return;

    setIsDeleting(true);
    try {
      await manageConcept.deleteConcept(currentConcept.id);
      toast.success("Concept deleted successfully");
      setCurrentConcept(null);
      setBannerPreviews([]);
      setVideoPreview(null);
      setLocalFile(null);
      if (onConceptUpdated) {
        onConceptUpdated();
      }
    } catch (error) {
      console.error("Delete concept error:", error);
      toast.error("Failed to delete concept");
    } finally {
      setIsDeleting(false);
    }
  };

  // 4. Submit Handler (Handles Upload + Creation)
  const onSubmit = useCallback(
    async (payload: CreateConceptPayload) => {
      try {
        let finalVideoUrl = payload.video_thumbnail;

        // Step A: Upload Video if we have a local file
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
            return; // Stop execution
          }
        }

        if (!finalVideoUrl) {
          toast.error("Please provide a video for the concept.");
          return;
        }

        // Step B: Submit to API
        const finalPayload = { ...payload, video_thumbnail: finalVideoUrl };

        const result = await dispatch(createConceptThunk(finalPayload)).unwrap();
        if (result) {
          try {
            await manageProduct.addConceptToLimitedProduct(productId, result.id);
            toast.success("Concept created and linked to product successfully");

            // Cleanup
            setIsCreateDialogOpen(false);
            reset();
            setBannerPreviews([]);
            setVideoPreview(null);
            setLocalFile(null);
            setCurrentConcept(result);

            if (onConceptUpdated) {
              onConceptUpdated();
            }
          } catch (linkError) {
            console.error("Failed to link concept to product:", linkError);
            toast.warning("Concept created but failed to link to product");
          }
        }
      } catch (error: any) {
        toast.error(error || "Failed to create concept");
      }
    },
    [dispatch, productId, reset, onConceptUpdated, localFile, uploadFileInChunks],
  );

  const onError = useCallback((errors: any) => {
    const firstError = errors[Object.keys(errors)[0]];
    toast.error(firstError?.message || "Please fill in all required fields");
  }, []);

  const handleOpenCreateDialog = () => {
    reset();
    setBannerPreviews([]);
    setVideoPreview(null);
    setLocalFile(null);
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 bg-white">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-white border-b px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <Video className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Concept Information
                </CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Video and banner content for limited product
                </p>
              </div>
            </div>
            {hasConcept ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteConcept}
                  disabled={isDeleting}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={handleOpenCreateDialog}
                  disabled={videoPreview !== null || bannerPreviews.length > 0}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleOpenCreateDialog}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Concept
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {currentConcept ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videoPreview && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-1 bg-violet-500 rounded-full" />
                      <Label className="text-sm font-semibold text-slate-700">
                        Video Thumbnail
                      </Label>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-100 shadow-lg bg-gradient-to-br from-slate-900 to-black">
                      <video src={videoPreview} controls className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Concept Name
                    </Label>
                    <p className="text-lg font-semibold text-slate-900 mt-1">
                      {currentConcept.name}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Description
                    </Label>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                      {currentConcept.description}
                    </p>
                  </div>
                </div>
              </div>
              {bannerPreviews.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-violet-500 rounded-full" />
                    <Label className="text-sm font-semibold text-slate-700">Banner Images</Label>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {bannerPreviews.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {bannerPreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-100 shadow-md hover:shadow-lg hover:border-violet-200 transition-all duration-300 group"
                      >
                        <img
                          src={url}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                <Video className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No Concept Created</h3>
              <p className="text-sm text-slate-500">
                Click "Create Concept" to add video and banner content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Editor Fullscreen Dialog */}
      <Dialog open={showAdvancedEditor} onOpenChange={setShowAdvancedEditor}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-transparent border-none shadow-none [&>button]:hidden">
          <DialogHeader className="sr-only">
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

      {/* Create Concept Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                Create New Concept
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new concept for this limited product with videos and banners
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Uploading Overlay */}
          {(isUploading || isUploadingBanner) && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-5 max-w-sm shadow-2xl border">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  {isUploading ? (
                    <Loader2 className="w-16 h-16 animate-spin text-primary relative" />
                  ) : (
                    <Upload className="w-16 h-16 animate-bounce text-primary relative" />
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold text-gray-900">
                    {isUploading ? "Uploading Video..." : "Uploading Images..."}
                  </p>
                  <p className="text-sm text-gray-500">Please wait while we process your files</p>
                </div>
                {isUploading && progress > 0 && (
                  <div className="w-full space-y-2">
                    <Progress value={progress} className="h-3 rounded-full" />
                    <p className="text-sm font-medium text-center text-primary">{progress}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onError)} className="px-6 py-5 space-y-6">
            {/* Video Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-lg font-semibold">Video Content</h3>
                <span className="text-xs text-red-500 font-medium px-2 py-0.5 bg-red-50 rounded-full">
                  Required
                </span>
              </div>

              {videoPreview ? (
                <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm bg-gradient-to-br from-gray-900 to-black">
                  <div className="aspect-video">
                    <video src={videoPreview} controls className="w-full h-full object-contain" />
                  </div>

                  {/* Floating Control Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                          <span className="text-xs font-medium text-white">Video Ready</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {localFile && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setShowAdvancedEditor(true)}
                            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          >
                            <Scissors className="w-4 h-4 mr-2" /> Edit Video
                          </Button>
                        )}
                        <input
                          id="video-replace"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => document.getElementById("video-replace")?.click()}
                          className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0"
                        >
                          <Upload className="h-4 w-4 mr-2" /> Replace
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveVideo}
                          className="shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="video-upload"
                  className="relative flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-10 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="p-4 bg-gray-100 rounded-2xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <Video className="h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors">
                      Click to upload video
                    </span>
                    <p className="text-xs text-gray-400">MP4, WebM, MOV up to 100MB</p>
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              )}
              {!localFile && errors.video_thumbnail && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <X className="h-4 w-4" /> {errors.video_thumbnail.message}
                </p>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-lg font-semibold">Concept Details</h3>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                    Concept Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter a memorable concept name"
                    className={`h-11 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-primary"}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:row-span-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your concept in detail..."
                    rows={5}
                    className={`resize-none ${errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-primary"}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Banners Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-lg font-semibold">Banner Images</h3>
                  <span className="text-xs text-red-500 font-medium px-2 py-0.5 bg-red-50 rounded-full">
                    Required
                  </span>
                </div>
                {bannerPreviews.length > 0 && (
                  <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                    {bannerPreviews.length} image{bannerPreviews.length !== 1 ? "s" : ""} uploaded
                  </span>
                )}
              </div>

              {bannerPreviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {bannerPreviews.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-video rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                      >
                        <img
                          src={url}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-lg"
                            onClick={() => handleRemoveBanner(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}

                    {/* Add More Card */}
                    <label
                      htmlFor="banner-upload"
                      className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all" />
                      <span className="text-xs font-medium text-gray-500 group-hover:text-primary">
                        Add More
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="banner-upload"
                  className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
                      Upload banner images
                    </span>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB each</p>
                  </div>
                </label>
              )}
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleBannerUpload}
                disabled={isUploadingBanner}
              />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t">
              <DialogFooter className="gap-3 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isUploading || isUploadingBanner}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isUploading ||
                    isUploadingBanner ||
                    !name ||
                    !description ||
                    !banner_url ||
                    (!video_thumbnail && !localFile)
                  }
                  className="px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Concept
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateConceptSection;
