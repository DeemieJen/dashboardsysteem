import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { User, UploadCloud } from 'lucide-react';


interface StudentProfileSettingsProps {
  student: any;
  onAvatarChange: (avatarUrl: string) => void | Promise<void>;
}

export function StudentProfileSettings({ student, onAvatarChange }: StudentProfileSettingsProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(student.avatar || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      await onAvatarChange(base64);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 rounded-3xl shadow-2xl animate-fade-in">
      <Card className="w-full max-w-md bg-white bg-opacity-90 border-0 shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-300 shadow-lg mb-2 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="object-cover w-full h-full" />
            ) : (
              <User className="w-16 h-16 text-purple-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">Jouw Profiel</CardTitle>
          <Badge className="bg-purple-200 text-purple-800 text-sm">{student.name}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-yellow-500 shadow-lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <UploadCloud className="w-4 h-4" />
            {uploading ? 'Uploaden...' : 'Upload nieuwe avatar'}
          </Button>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Kies een leuke profielfoto! PNG, JPG, GIF toegestaan.<br />
            Je avatar wordt overal in het dashboard getoond.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
