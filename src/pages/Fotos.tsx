
import { useState, useEffect } from 'react';
import { Camera, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface PhotoEntry {
  id: string;
  date: string;
  dataUrl: string;
  day: number;
}

const Fotos = () => {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const savedPhotos = getFromStorage(StorageKeys.FOTOS, []);
    setPhotos(savedPhotos);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate day number (assuming day 1 is when first photo was taken)
      const dayNumber = photos.length + 1;
      
      const newPhoto: PhotoEntry = {
        id: Date.now().toString(),
        date: today,
        dataUrl,
        day: dayNumber > 28 ? 28 : dayNumber
      };

      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      saveToStorage(StorageKeys.FOTOS, updatedPhotos);
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    saveToStorage(StorageKeys.FOTOS, updatedPhotos);
    setIsDialogOpen(false);
  };

  const openPhotoDialog = (photo: PhotoEntry) => {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (photos.length === 0) return;
    
    let newIndex = selectedIndex;
    if (direction === 'prev') {
      newIndex = selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1;
    } else {
      newIndex = selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0;
    }
    
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Camera className="text-fitness-red" />
          Fotos de Progresso
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Documente sua transformação dia a dia
        </p>
        
        <div className="bg-fitness-gray-dark p-6 rounded-xl">
          <div className="text-3xl font-bold text-fitness-red mb-2">
            {photos.length}/28
          </div>
          <p className="text-fitness-gray-light">Fotos Registradas</p>
        </div>
      </div>

      <Card className="glass-effect border-fitness-red">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Adicionar Nova Foto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-block"
            >
              <div className="border-2 border-dashed border-fitness-red rounded-lg p-8 hover:bg-fitness-red/10 transition-all duration-300">
                <Camera className="h-12 w-12 text-fitness-red mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">Clique para adicionar foto</p>
                <p className="text-fitness-gray-light text-sm">
                  Tire uma foto do seu progresso hoje
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="glass-effect border-fitness-gray-dark hover-lift cursor-pointer group"
              onClick={() => openPhotoDialog(photo)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-2">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={photo.dataUrl}
                    alt={`Progresso dia ${photo.day}`}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Dia {photo.day}</p>
                    <p className="text-fitness-gray-light text-xs">{formatDate(photo.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4 p-12">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-bold text-fitness-gray-light">Nenhuma foto ainda</h3>
          <p className="text-fitness-gray-light">
            Comece a documentar sua jornada! Adicione sua primeira foto de progresso.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-fitness-gray-dark border-fitness-gray-light max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-fitness-red" />
                Dia {selectedPhoto?.day} - {selectedPhoto ? formatDate(selectedPhoto.date) : ''}
              </span>
              <Button
                onClick={() => selectedPhoto && deletePhoto(selectedPhoto.id)}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedPhoto.dataUrl}
                  alt={`Progresso dia ${selectedPhoto.day}`}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                
                {photos.length > 1 && (
                  <>
                    <Button
                      onClick={() => navigatePhoto('prev')}
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => navigatePhoto('next')}
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm text-fitness-gray-light">
                <span>Foto {selectedIndex + 1} de {photos.length}</span>
                <span>Adicionada em {formatDate(selectedPhoto.date)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="text-center space-y-4 p-6 bg-fitness-gray-dark rounded-xl">
        <h3 className="text-xl font-bold text-fitness-red">📷 Dica de Fotografia</h3>
        <p className="text-fitness-gray-light">
          Tire fotos sempre no mesmo horário, com a mesma roupa e no mesmo local. 
          Isso vai deixar sua evolução muito mais visível. <strong className="text-white">Seja consistente!</strong>
        </p>
      </div>
    </div>
  );
};

export default Fotos;
