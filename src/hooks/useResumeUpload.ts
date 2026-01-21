import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadResume = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);

    try {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
        return null;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return null;
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `resume.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      setProgress(25);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Overwrite existing resume
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      setProgress(75);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      setProgress(100);

      toast({
        title: "Resume uploaded!",
        description: "Your resume has been uploaded successfully.",
      });

      return urlData.publicUrl;
    } catch (err) {
      console.error("Error uploading resume:", err);
      toast({
        title: "Upload error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const deleteResume = useCallback(async (resumeUrl: string): Promise<boolean> => {
    try {
      // Extract path from URL
      const url = new URL(resumeUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/assets\/(.+)/);
      
      if (!pathMatch) {
        console.error("Invalid resume URL format");
        return false;
      }

      const filePath = pathMatch[1];

      const { error } = await supabase.storage
        .from("assets")
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Resume deleted",
        description: "Your resume has been removed.",
      });

      return true;
    } catch (err) {
      console.error("Error deleting resume:", err);
      return false;
    }
  }, [toast]);

  return {
    uploadResume,
    deleteResume,
    uploading,
    progress,
  };
};
