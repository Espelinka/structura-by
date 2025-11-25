import { FC, ChangeEvent, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  disabled?: boolean;
}

export const ImageUpload: FC<ImageUploadProps> = ({ images, onImagesChange, disabled }) => {
  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const newImageFiles: ImageFile[] = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      onImagesChange([...images, ...newImageFiles]);
    }
  }, [images, onImagesChange]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        disabled ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-engineering-500 bg-white hover:bg-engineering-50'
      }`}>
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <div className="h-12 w-12 bg-engineering-100 text-engineering-600 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Загрузите фото дефектов</h3>
          <p className="text-slate-500 mt-2 text-sm">Перетащите или нажмите для выбора</p>
          <p className="text-slate-400 mt-1 text-xs">Поддерживаются JPG, PNG, WEBP</p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={img.preview}
                alt={`Загрузка ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <div className="flex items-center text-white text-xs truncate">
                  <ImageIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{img.file.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};