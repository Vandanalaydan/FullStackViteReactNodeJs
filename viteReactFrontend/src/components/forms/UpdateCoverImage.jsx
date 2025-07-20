import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { useUpdateCoverImageMutation } from "../../store/apiSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

export default function UpdateCoverImage() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [updateCoverImage, { isLoading }] = useUpdateCoverImageMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!data.coverImage?.[0]) return alert("Please select a cover image");

    const formData = new FormData();
    formData.append("coverImage", data.coverImage[0]);

    try {
      const response = await updateCoverImage(formData).unwrap();
      dispatch(setCredentials({ user: response.data }));
      alert("Cover image updated successfully");
      reset();
      navigate("/users/current-user");
    } catch (error) {
      console.error("Cover image update failed:", error);
      alert("Failed to update cover image");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="coverImage">Choose Cover Image</Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          {...register("coverImage", { required: "Cover image is required" })}
        />
        {errors.coverImage && <p className="text-red-500">{errors.coverImage.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Cover Image"}
      </Button>
    </form>
  );
}
