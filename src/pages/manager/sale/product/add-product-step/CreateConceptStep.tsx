import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const { uploadFileInChunks, progress, isUploading, error: uploadError } = useChunkUpload();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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

  useEffect(() => {
    const savedConcept = getItem<CreateConceptPayload>("currentConcept");
    if (savedConcept) {
      reset(savedConcept);
      if (savedConcept.banner_url) {
        setBannerPreview(savedConcept.banner_url);
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

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setBannerPreview(imageUrl);
      setValue("banner_url", imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setValue("video_thumbnail", "");
  };

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    setValue("banner_url", "");
  };

  const onSubmit = useCallback(
    async (payload: CreateConceptPayload) => {
      try {
        const existingConceptId = getItem("currentConceptId");
        if (existingConceptId) {
          toast.info("Concept already created, moving to next step");
          navigate(steps[currentStep]?.path, { state });
          return;
        }

        const result = await dispatch(createConceptThunk(payload)).unwrap();
        if (result) {
          setItem("currentConcept", payload);
          setItem("currentConceptId", result.id);

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
        toast.error(error || "Failed to create concept");
      }
    },
    [dispatch, navigate, steps, currentStep, state],
  );

  const onError = useCallback((errors: any) => {
    const firstError = errors[Object.keys(errors)[0]];
    toast.error(firstError?.message || "Please fill in all required fields");
  }, []);

  useEffect(() => {
    if (setOnSubmitStep) {
      const existingConcept = getItem("currentConceptId");
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

  useEffect(() => {
    const formData = {
      name,
      description,
      banner_url,
      video_thumbnail,
    };
    setItem("currentConcept", formData);
  }, [name, description, banner_url, video_thumbnail]);

  return (
    <div className="space-y-6 mb-12 mt-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Concept Information</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="conceptName"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600 mr-1">*</span>
              Concept Name
            </Label>
            <Input
              id="conceptName"
              placeholder="Enter concept name"
              className="col-span-3"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600 col-start-2 col-span-3">{errors.name.message}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
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
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600 mr-1">*</span>
              Banner Image
            </Label>
            <div className="col-span-3 space-y-4">
              {!bannerPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload banner image (Max 5MB)</p>
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("banner-upload")?.click()}
                  >
                    Choose Image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full max-h-[300px] object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Label
              htmlFor="video"
              className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
            >
              <span className="text-red-600 mr-1">*</span>
              Video
            </Label>
            <div className="col-span-3 space-y-4">
              {!videoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload video file (Max 100MB)</p>
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

              {uploadError && <p className="text-sm text-red-600">Upload error: {uploadError}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
