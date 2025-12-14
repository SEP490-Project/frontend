import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useOutletContext, type NavigateFunction } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createConceptSchema } from "@/libs/validation/conceptValidation";
import { useChunkUpload } from "@/libs/hooks/useChunkUpload";
import { useAppDispatch } from "@/libs/stores";
import { createConceptThunk } from "@/libs/stores/conceptManager/thunk";
import manageProduct from "@/libs/services/manageProduct";
import { getItem, setItem } from "@/libs/local-storage";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import type { CreateConceptPayload } from "@/libs/types/concept";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { useAuth } from "@/libs/hooks/useAuth";

export const CreateConceptStep = () => {
  const { setOnSubmitStep, steps, currentStep, navigate, state, setIsDisabled } = useOutletContext<{
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
  const { uploadFileInChunks, progress, isUploading } = useChunkUpload();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
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

  useEffect(() => {
    const savedConcept = getItem<CreateConceptPayload>("currentConcept");
    if (savedConcept) {
      reset(savedConcept);
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
      if (savedConcept.video_thumbnail) {
        setVideoPreview(savedConcept.video_thumbnail);
      }
    }
  }, [reset]);

  useEffect(() => {
    const isValid = Boolean(
      name &&
        name.trim() !== "" &&
        description &&
        description.trim() !== "" &&
        banner_url &&
        video_thumbnail &&
        !errors.name &&
        !errors.description &&
        !errors.banner_url &&
        !errors.video_thumbnail,
    );
    setIsDisabled(!isValid);
  }, [name, description, banner_url, video_thumbnail, errors, setIsDisabled]);

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

    // Validate all files
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

      // Response is an object with URLs array
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
      // Reset input
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

  const onSubmit = useCallback(
    async (payload: CreateConceptPayload) => {
      try {
        const existingConcept = getItem("currentConcept");
        if (existingConcept) {
          toast.info("Concept already created, moving to next step");
          navigate(steps[currentStep]?.path, { state });
          return;
        }

        setIsDisabled(true);
        const result = await dispatch(createConceptThunk(payload)).unwrap();
        if (result) {
          setItem("currentConcept", payload);

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

          navigate(steps[currentStep]?.path, { state });
        }
      } catch (error: any) {
        toast.error(error || "Failed to create  concept");
      } finally {
        setIsDisabled(false);
      }
    },
    [dispatch, navigate, steps, currentStep, state, setIsDisabled],
  );

  const onError = useCallback((errors: any) => {
    const firstError = errors[Object.keys(errors)[0]];
    toast.error(firstError?.message || "Please fill in all required fields");
  }, []);

  useEffect(() => {
    if (setOnSubmitStep) {
      const existingConcept = getItem("currentConcept");
      if (existingConcept) {
        setOnSubmitStep(() => async () => {
          navigate(steps[currentStep]?.path, { state });
        });
        return;
      }

      const submitHandler = async () => {
        await handleSubmit(onSubmit, onError)();
      };
      setOnSubmitStep(() => submitHandler);
    }
  }, [setOnSubmitStep, handleSubmit, onSubmit, onError, navigate, steps, currentStep, state]);

  return (
    <div className="space-y-6 mb-12 mt-6">
      {(isUploading || isUploadingBanner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-full">
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

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Concept Information</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {videoPreview && (
              <div className="col-span-2 space-y-4">
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
                  <p className="text-sm text-red-600 col-start-2 col-span-3">
                    {errors.name.message}
                  </p>
                )}

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

                    {/* Preview Grid */}
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
            )}

            <div className={`space-y-4 ${videoPreview ? "col-span-2" : "col-span-4"}`}>
              {!videoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload concept video file (Max 100MB)</p>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("video-upload")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Choose Video"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <video src={videoPreview} controls className="w-full object-cover rounded-lg">
                      Your browser does not support the video tag.
                    </video>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading video...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
