
import { auth } from "./firebase";

// Base URL for API
const API_BASE_URL = import.meta.env.VITE_FIREBASE_API || "https://us-central1-insync-backend-bd86e.cloudfunctions.net/api";

interface UploadResponse {
    url: string;
    path: string;
}

/**
 * Uploads a file to the backend.
 * @param file The file to upload
 * @param type The type of file ('profile_pic' or 'logo')
 * @param entityId Optional. ID of the entity (user or firm). Defaults to current user's UID.
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (file: File, type: "profile_pic" | "logo", entityId?: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to upload files.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("entityId", entityId || user.uid);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
            // Fetch automatically sets Content-Type to multipart/form-data with boundary
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Upload failed");
        }

        const data: UploadResponse = await response.json();
        return data.url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export const deleteFile = async (url: string): Promise<void> => {
    const API_BASE_URL = import.meta.env.VITE_FIREBASE_API || "https://us-central1-insync-backend-bd86e.cloudfunctions.net/api";

    // Remove trailing slash if present
    const sanitizedApi = API_BASE_URL.replace(/\/$/, "");

    try {
        const response = await fetch(`${sanitizedApi}/upload`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
};

