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
import { Upload, Trash2, Video, Plus, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import manageConcept from "@/libs/services/manageConcept";
import manageProduct from "@/libs/services/manageProduct";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

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
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);

    try {
      toast.info("Uploading video...");
      const response = await uploadFileInChunks(file);
      if (response && response.data.HostURL) {
        setValue("video_thumbnail", response.data.HostURL);
        toast.success("Video uploaded successfully!");
      } else {
        toast.error("Failed to upload video");
        setVideoPreview(null);
      }
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Failed to upload video");
      setVideoPreview(null);
    }
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

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setValue("video_thumbnail", "");
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

  const onSubmit = useCallback(
    async (payload: CreateConceptPayload) => {
      try {
        const result = await dispatch(createConceptThunk(payload)).unwrap();
        if (result) {
          try {
            await manageProduct.addConceptToLimitedProduct(productId, result.id);
            toast.success("Concept created and linked to product successfully");
            setIsCreateDialogOpen(false);
            reset();
            setBannerPreviews([]);
            setVideoPreview(null);
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
    [dispatch, productId, reset, onConceptUpdated],
  );

  const onError = useCallback((errors: any) => {
    const firstError = errors[Object.keys(errors)[0]];
    toast.error(firstError?.message || "Please fill in all required fields");
  }, []);

  const handleOpenCreateDialog = () => {
    reset();
    setBannerPreviews([]);
    setVideoPreview(null);
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Concept Information
          </CardTitle>
          {hasConcept ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConcept}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Concept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenCreateDialog}
                disabled={videoPreview !== null || bannerPreviews.length > 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          ) : (
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Concept
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {currentConcept ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoPreview && (
                  <div>
                    <Label className="text-sm font-medium">Video Thumbnail</Label>
                    <div className="relative aspect-video rounded-lg overflow-hidden border mt-2 max-w-md">
                      <video src={videoPreview} controls className="w-full h-full" />
                    </div>
                  </div>
                )}
                <div className="space-y-4 flex flex-col justify-center">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-gray-700 mt-1">{currentConcept.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-700 mt-1">{currentConcept.description}</p>
                  </div>
                  {bannerPreviews.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Banner Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {bannerPreviews.map((url, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden border"
                          >
                            <img
                              src={url}
                              alt={`Banner ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No concept created yet. Click "Create Concept" to add one.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Concept Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Concept</DialogTitle>
            <DialogDescription>
              Add a new concept for this limited product with videos and banners
            </DialogDescription>
          </DialogHeader>

          {(isUploading || isUploadingBanner) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-md">
                <Upload className="w-12 h-12 animate-pulse text-primary" />
                <p className="text-lg font-semibold">
                  {isUploading ? "Uploading video..." : "Uploading images..."}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Please wait while we upload your files
                </p>
                {isUploading && progress > 0 && (
                  <div className="w-full">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-gray-600 text-center mt-2">{progress}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {/* Video Preview Section */}
              {videoPreview && (
                <div className="col-span-2 space-y-2">
                  <Label>Video Preview</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <video src={videoPreview} controls className="w-full h-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveVideo}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Form Fields Section */}
              <div className={`space-y-4 ${videoPreview ? "col-span-2" : "col-span-4"}`}>
                <div>
                  <Label htmlFor="name">
                    Concept Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter concept name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter concept description"
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                {videoPreview || bannerPreviews.length > 0 ? null : (
                  <div>
                    <Label htmlFor="video">
                      Video Thumbnail <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <label
                        htmlFor="video-upload"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      >
                        <Video className="h-5 w-5" />
                        <span className="text-sm">
                          {videoPreview ? "Change Video" : "Upload Video"}
                        </span>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    {errors.video_thumbnail && (
                      <p className="text-sm text-red-500 mt-1">{errors.video_thumbnail.message}</p>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor="banner">
                    Banner Images <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleBannerUpload}
                      disabled={isUploadingBanner}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("banner-upload")?.click()}
                      disabled={isUploadingBanner}
                      className="mt-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Banners
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Previews */}
            {bannerPreviews.length > 0 && (
              <div className="space-y-2">
                <Label>Banner Previews ({bannerPreviews.length})</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {bannerPreviews.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleRemoveBanner(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isUploading || isUploadingBanner}
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
                  !video_thumbnail
                }
              >
                Create Concept
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateConceptSection;
