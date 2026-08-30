import { User } from "@/types/shared";
import { http } from "../http";

// Update profile photo
type UpdateProfilePhotoResponse =
  | { result: false }
  | { result: true; message: string; user: User };

export async function updateProfilePhoto(
  file: File,
): Promise<UpdateProfilePhotoResponse> {
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const { data } = await http.post<{ message: string; user: User }>(
      "/api/auth/profile-photo",
      formData,
    );
    // console.log(data);

    return { result: true, message: data.message, user: data.user };
  } catch (error) {
    console.error("Failed to update profile photo:", error);
    return { result: false };
  }
}
