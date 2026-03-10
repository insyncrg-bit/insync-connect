
import { auth } from "./firebase";

// Base URL for API
const API_BASE_URL = import.meta.env.VITE_FIREBASE_API || "https://us-central1-insync-backend-bd86e.cloudfunctions.net/api";

// Base URL for Memo Inferencer service
const INFERENCER_URL = "https://memo-inferencer-970620251155.us-east4.run.app";

interface UploadResponse {
    url: string;
    path: string;
}

/**
 * Uploads a file to the backend.
 * @param file The file to upload
 * @param type The type of file ('profile_pic' | 'logo' | 'startup_logo' | 'pitchdeck')
 * @param entityId Optional. ID of the entity (user or firm). Defaults to current user's UID.
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (file: File, type: "profile_pic" | "logo" | "startup_logo" | "pitchdeck", entityId?: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to upload files.");
    }

    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("entityId", entityId || user.uid);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            // Fetch automatically sets Content-Type to multipart/form-data with boundary
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.error || "Upload failed";
            const detail = errorData.detail ? `: ${errorData.detail}` : "";
            throw new Error(msg + detail);
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

    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to delete files.");
    }
    const token = await user.getIdToken();

    try {
        const response = await fetch(`${sanitizedApi}/upload`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const detail = errData?.error || errData?.detail || response.statusText || "Unknown error";
            throw new Error(`Delete failed: ${detail}`);
        }
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
};

/**
 * Calls the AI Memo Inferencer service to extract startup data from a pitch deck PDF URL.
 */
export const inferMemo = async (url: string): Promise<{ success: boolean; data: any; timing: any }> => {
    try {
        const response = await fetch(`${INFERENCER_URL}/infer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData?.detail?.message || errorData?.error || "Inference failed";
            const code = errorData?.detail?.code ? ` (${errorData.detail.code})` : "";
            throw new Error(msg + code);
        }

        return await response.json();
    } catch (error) {
        console.error("Inference error:", error);
        throw error;
    }
};

