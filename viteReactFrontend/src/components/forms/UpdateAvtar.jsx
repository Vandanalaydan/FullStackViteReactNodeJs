import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { useUpdateAvatarMutation } from "../../store/apiSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom"; // ✅ optional redirect


export default function UpdateAvatarForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
    const navigate = useNavigate(); //

  const onSubmit = async (data) => {
    if (!data.avatar[0]) return alert("Please select an avatar");

    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);

    try {
      const response = await updateAvatar(formData).unwrap();
      dispatch(setCredentials({ user: response.data }));
      alert("Avatar updated successfully");
      reset();
      navigate("/users/current-user");
    } catch (error) {
      console.error("Avatar update failed:", error);
      alert("Failed to update avatar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="avatar">Choose Avatar</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          {...register("avatar", { required: "Avatar is required" })}
        />
        {errors.avatar && <p className="text-red-500">{errors.avatar.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Avatar"}
      </Button>
    </form>
  );
}
