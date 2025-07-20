import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useChangePasswordMutation } from "../../store/apiSlice";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      alert("Password changed successfully");
      reset();
    } catch (error) {
      console.error("Change password error:", error);
      alert(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
      <div>
        <Label htmlFor="oldPassword">Old Password</Label>
        <Input
          id="oldPassword"
          type="password"
          {...register("oldPassword", { required: "Old password is required" })}
        />
        {errors.oldPassword && <p className="text-red-500">{errors.oldPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Must be at least 6 characters",
            },
          })}
        />
        {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}
