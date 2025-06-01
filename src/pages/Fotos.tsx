
import { useState, useEffect } from 'react';
import { Camera, Upload, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface PhotoEntry {
  id: string;
  date: string;
  time: string;
  dataUrl: string;
  day: number;
}

const Fotos = () => {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedPhotos = getFromStorage(StorageKeys.FOTOS, []);
    // Ordenar do mais recente para o mais antigo
    const sortedPhotos = savedPhotos.sort((a: PhotoEntry, b: PhotoEntry) => 
      new Date(b.date + ' ' + (b.time || '00:00')).getTime() - new Date(a.date + ' ' + (a.time || '00:00')).getTime()
    );
    setPhotos(sortedPhotos);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Calculate day number (assuming day 1 is when first photo was taken)
      const dayNumber = photos.length + 1;
      
      const newPhoto: PhotoEntry = {
        id: Date.now().toString(),
        date: today,
        time: currentTime,
        dataUrl,
        day: dayNumber > 28 ? 28 : dayNumber
      };

      const updatedPhotos = [newPhoto, ...photos]; // Adicionar no início da lista
      setPhotos(updatedPhotos);
      saveToStorage(StorageKeys.FOTOS, updatedPhotos);
      
      toast({
        title: "📸 Foto Adicionada!",
        description: `Foto do dia ${newPhoto.day} salva com sucesso!`,
        duration: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const confirmDeletePhoto = (photoId: string) => {
    setPhotoToDelete(photoId);
    setShowDeleteAlert(true);
  };

  const deletePhoto = () => {
    if (!photoToDelete) return;
    
    const updatedPhotos = photos.filter(photo => photo.id !== photoToDelete);
    setPhotos(updatedPhotos);
    saveToStorage(StorageKeys.FOTOS, updatedPhotos);
    setIsDialogOpen(false);
    setShowDeleteAlert(false);
    setPhotoToDelete(null);
    
    toast({
      title: "🗑️ Foto Excluída",
      description: "Foto removida com sucesso!",
      duration: 3000,
    });
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
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Camera className="text-cyan-500 animate-glow" />
          Fotos de Progresso
        </h1>
        <p className="text-fitness-gray-light text-base md:text-lg">
          Documente sua transformação dia a dia
        </p>
        
        <div className="bg-fitness-gray-dark p-4 md:p-6 rounded-xl hover-lift">
          <div className="text-2xl md:text-3xl font-bold text-cyan-500 mb-2 animate-pulse-strong">
            {photos.length}/28
          </div>
          <p className="text-fitness-gray-light">Fotos Registradas</p>
        </div>
      </div>

      <Card className="glass-effect border-cyan-500/50 hover-lift animate-slide-in">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
            <Upload className="h-5 w-5 animate-bounce-subtle" />
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
              <div className="border-2 border-dashed border-cyan-500 rounded-lg p-6 md:p-8 hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105">
                <Camera className="h-8 md:h-12 w-8 md:w-12 text-cyan-500 mx-auto mb-4 animate-bounce-subtle" />
                <p className="text-white font-semibold mb-2 text-sm md:text-base">Clique para adicionar foto</p>
                <p className="text-fitness-gray-light text-xs md:text-sm">
                  Tire uma foto do seu progresso hoje
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 stagger-animation">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="glass-effect border-fitness-gray-dark hover-lift cursor-pointer group animate-slide-up"
              onClick={() => openPhotoDialog(photo)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-2 relative">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={photo.dataUrl}
                    alt={`Progresso dia ${photo.day}`}
                    className="w-full h-32 md:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Camera className="h-6 md:h-8 w-6 md:w-8 text-white" />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeletePhoto(photo.id);
                        }}
                        size="sm"
                        variant="destructive"
                        className="p-1 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">Dia {photo.day}</p>
                    <p className="text-fitness-gray-light text-xs">{formatDate(photo.date)}</p>
                    {photo.time && (
                      <p className="text-cyan-400 text-xs">{photo.time}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4 p-8 md:p-12 animate-bounce-subtle">
          <div className="text-4xl md:text-6xl mb-4">📸</div>
          <h3 className="text-lg md:text-xl font-bold text-fitness-gray-light">Nenhuma foto ainda</h3>
          <p className="text-fitness-gray-light text-sm md:text-base">
            Comece a documentar sua jornada! Adicione sua primeira foto de progresso.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-fitness-gray-dark border-fitness-gray-light max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm md:text-base">
                <Camera className="h-5 w-5 text-cyan-500" />
                Dia {selectedPhoto?.day} - {selectedPhoto ? formatDate(selectedPhoto.date) : ''}
                {selectedPhoto?.time && (
                  <span className="text-cyan-400 text-sm">às {selectedPhoto.time}</span>
                )}
              </span>
              <Button
                onClick={() => selectedPhoto && confirmDeletePhoto(selectedPhoto.id)}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
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
                <span>
                  Adicionada em {formatDate(selectedPhoto.date)}
                  {selectedPhoto.time && ` às ${selectedPhoto.time}`}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-fitness-gray-dark border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-fitness-gray-light">
              Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-fitness-gray-light text-white hover:bg-fitness-gray-light">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePhoto}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="text-center space-y-4 p-4 md:p-6 bg-fitness-gray-dark rounded-xl hover-lift animate-slide-up">
        <h3 className="text-lg md:text-xl font-bold text-cyan-500">📷 Dica de Fotografia</h3>
        <p className="text-fitness-gray-light text-sm md:text-base">
          Tire fotos sempre no mesmo horário, com a mesma roupa e no mesmo local. 
          Isso vai deixar sua evolução muito mais visível. <strong className="text-white">Seja consistente!</strong>
        </p>
      </div>
    </div>
  );
};

export default Fotos;
