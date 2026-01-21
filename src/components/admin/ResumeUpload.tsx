import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useResumeUpload } from "@/hooks/useResumeUpload";
import { Upload, FileText, Trash2, ExternalLink } from "lucide-react";

interface ResumeUploadProps {
  resumeUrl: string | null;
  onResumeChange: (url: string | null) => void;
}

const ResumeUpload = ({ resumeUrl, onResumeChange }: ResumeUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadResume, deleteResume, uploading, progress } = useResumeUpload();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    const url = await uploadResume(file);
    if (url) {
      onResumeChange(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDelete = async () => {
    if (resumeUrl) {
      const success = await deleteResume(resumeUrl);
      if (success) {
        onResumeChange(null);
      }
    }
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume
        </CardTitle>
        <CardDescription>
          Upload your resume for recruiters to download. Supports PDF and Word documents (max 10MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resumeUrl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Resume uploaded</p>
                  <p className="text-sm text-muted-foreground">Click to view or download</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resumeUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a new file to replace the current resume.
            </p>
          </div>
        ) : null}

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
          />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <Upload className="w-12 h-12 mx-auto text-primary" />
              </div>
              <p className="text-muted-foreground">Uploading...</p>
              <Progress value={progress} className="w-48 mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">
                {resumeUrl ? "Replace resume" : "Upload your resume"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
