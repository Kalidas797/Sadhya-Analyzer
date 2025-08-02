import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-leaf-green/30 bg-gradient-warm hover:border-leaf-green/50 transition-all duration-300">
      <div
        className="flex flex-col items-center justify-center space-y-6 min-h-[300px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden shadow-leaf">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Sadhya"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-leaf-green font-medium">
              {selectedImage.name}
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="border-leaf-green text-leaf-green hover:bg-leaf-green hover:text-white"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Change Image
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-festival-gold/20 flex items-center justify-center">
              <Upload className="h-12 w-12 text-leaf-green" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-leaf-green">
                Upload Your Sadhya Photo
              </h3>
              <p className="text-muted-foreground">
                Drop your banana leaf meal photo here or click to browse
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="festival"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="shadow-festival"
              >
                <Camera className="mr-2 h-4 w-4" />
                Choose Photo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, WebP formats
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};