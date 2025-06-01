
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { saveToStorage, getFromStorage, StorageKeys, getProgressColor } from '@/utils/storage';
import { Confetti } from '@/components/Confetti';
import { toast } from '@/hooks/use-toast';

interface DayChecklist {
  treino_manha: boolean;
  treino_tarde: boolean;
  treino_noite: boolean;
  alimentacao_limpa: boolean;
  agua_3_4l: boolean;
  foto_tirada: boolean;
  sono_7h: boolean;
  [key: string]: boolean;
}

interface CheckInData {
  [day: number]: DayChecklist;
}

const defaultChecklist: DayChecklist = {
  treino_manha: false,
  treino_tarde: false,
  treino_noite: false,
  alimentacao_limpa: false,
  agua_3_4l: false,
  foto_tirada: false,
  sono_7h: false,
};

const checklistItems = [
  { key: 'treino_manha', label: 'Treino Manhã', emoji: '🌅' },
  { key: 'treino_tarde', label: 'Treino Tarde', emoji: '☀️' },
  { key: 'treino_noite', label: 'Treino Noite', emoji: '🌙' },
  { key: 'alimentacao_limpa', label: 'Alimentação Limpa', emoji: '🥗' },
  { key: 'agua_3_4l', label: 'Água 3-4L', emoji: '💧' },
  { key: 'foto_tirada', label: 'Foto Tirada', emoji: '📸' },
  { key: 'sono_7h', label: 'Sono 7h+', emoji: '😴' },
];

const CheckIn = () => {
  const [checkInData, setCheckInData] = useState<CheckInData>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const saved = getFromStorage(StorageKeys.CHECKIN, {});
    setCheckInData(saved);
  }, []);

  const getDayChecklist = (day: number): DayChecklist => {
    return checkInData[day] || { ...defaultChecklist };
  };

  const updateDayChecklist = (day: number, checklist: DayChecklist) => {
    const updated = { ...checkInData, [day]: checklist };
    setCheckInData(updated);
    saveToStorage(StorageKeys.CHECKIN, updated);
  };

  const toggleChecklistItem = (day: number, key: keyof DayChecklist) => {
    const currentChecklist = getDayChecklist(day);
    const updatedChecklist = { ...currentChecklist, [key]: !currentChecklist[key] };
    const wasComplete = getDayProgress(day) === 100;
    
    updateDayChecklist(day, updatedChecklist);
    
    // Check if day just became complete
    const newProgress = getDayProgress(day, updatedChecklist);
    if (!wasComplete && newProgress === 100) {
      setShowConfetti(true);
      toast({
        title: "🏆 Dia Perfeito!",
        description: `Parabéns! Você completou 100% do dia ${day}!`,
        duration: 5000,
      });
    }
  };

  const openDayDialog = (day: number) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };

  const getDayProgress = (day: number, checklist?: DayChecklist): number => {
    const dayChecklist = checklist || getDayChecklist(day);
    const totalItems = Object.keys(dayChecklist).length - 1; // Subtract 1 for the index signature
    const completedItems = Object.values(dayChecklist).filter(Boolean).length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getCompletedDays = (): number => {
    return Array.from({ length: 28 }, (_, i) => i + 1)
      .filter(day => getDayProgress(day) === 100).length;
  };

  const getDayColor = (progress: number): string => {
    if (progress === 100) return 'bg-purple-500';
    if (progress >= 90) return 'bg-green-600';
    if (progress >= 75) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-400';
    if (progress >= 30) return 'bg-orange-400';
    if (progress >= 15) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Calendar className="text-indigo-500" />
            Check-in Diário
          </h1>
          <p className="text-fitness-gray-light text-base md:text-lg">
            28 dias para a transformação completa
          </p>
          
          <div className="bg-fitness-gray-dark p-4 md:p-6 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold text-indigo-500 mb-2">
              {getCompletedDays()}/28
            </div>
            <p className="text-fitness-gray-light">Dias 100% Completos</p>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const progress = getDayProgress(day);
            const progressColor = getDayColor(progress);
            
            return (
              <Card
                key={day}
                onClick={() => openDayDialog(day)}
                className={`
                  cursor-pointer hover-lift transition-all duration-300 border-fitness-gray-dark
                  hover:border-indigo-500 hover:scale-105
                `}
              >
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="text-lg md:text-xl font-bold text-white mb-2">
                    {day}
                  </div>
                  <div 
                    className={`w-full h-2 rounded-full ${progressColor} transition-all duration-300`}
                  />
                  <div className="text-xs text-fitness-gray-light mt-1">
                    {progress}%
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-fitness-gray-dark border-fitness-gray-light max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Dia {selectedDay}
              </DialogTitle>
            </DialogHeader>
            
            {selectedDay && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`
                    w-full h-4 rounded-full mb-2 transition-all duration-300
                    ${getDayColor(getDayProgress(selectedDay))}
                  `} />
                  <p className="text-fitness-gray-light text-sm">
                    Progresso: {getDayProgress(selectedDay)}%
                  </p>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item) => {
                    const checklist = getDayChecklist(selectedDay);
                    const isChecked = checklist[item.key as keyof DayChecklist];
                    
                    return (
                      <div
                        key={item.key}
                        onClick={() => toggleChecklistItem(selectedDay, item.key as keyof DayChecklist)}
                        className={`
                          flex items-center justify-between p-3 rounded-lg cursor-pointer
                          transition-all duration-300 hover:bg-indigo-500/20
                          ${isChecked ? 'bg-green-500/20 border border-green-500' : 'bg-fitness-gray-dark/50'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <span className={`font-medium ${isChecked ? 'text-green-400' : 'text-white'}`}>
                            {item.label}
                          </span>
                        </div>
                        
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          transition-all duration-300
                          ${isChecked 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-fitness-gray-light hover:border-indigo-500'
                          }
                        `}>
                          {isChecked && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getDayProgress(selectedDay) === 100 && (
                  <div className="text-center space-y-2 animate-bounce-subtle">
                    <div className="text-4xl">🏆</div>
                    <p className="text-indigo-500 font-bold">Dia Perfeito!</p>
                  </div>
                )}

                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  Fechar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="text-center space-y-4 p-4 md:p-6 bg-fitness-gray-dark rounded-xl">
          <h3 className="text-lg md:text-xl font-bold text-indigo-500">🎯 Meta Diária</h3>
          <p className="text-fitness-gray-light text-sm md:text-base">
            Complete 100% do checklist todos os dias. Não existe meio termo. 
            Seja <strong className="text-white">INSANO</strong> na sua disciplina!
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckIn;
