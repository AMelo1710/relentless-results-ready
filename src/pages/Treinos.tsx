
import { useState, useEffect } from 'react';
import { Activity, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface Exercise {
  id: string;
  name: string;
  sets: string;
  completed: boolean;
}

const defaultExercises: Exercise[] = [
  { id: '1', name: 'Corrida', sets: '4x45s', completed: false },
  { id: '2', name: 'Mountain Climber', sets: '4x45s', completed: false },
  { id: '3', name: 'Abdominal Crunch', sets: '4x45s', completed: false },
  { id: '4', name: 'Prancha Abdominal', sets: '4x45s', completed: false },
  { id: '5', name: 'Flexão de braço', sets: 'até a falha (2x)', completed: false },
  { id: '6', name: 'Agachamento', sets: 'até a falha (2x)', completed: false },
];

const Treinos = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const savedExercises = getFromStorage(StorageKeys.TREINOS, defaultExercises);
    setExercises(savedExercises);
  }, []);

  const toggleExercise = (id: string) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.id === id ? { ...exercise, completed: !exercise.completed } : exercise
    );
    setExercises(updatedExercises);
    saveToStorage(StorageKeys.TREINOS, updatedExercises);
  };

  const resetAll = () => {
    const resetExercises = exercises.map(exercise => ({ ...exercise, completed: false }));
    setExercises(resetExercises);
    saveToStorage(StorageKeys.TREINOS, resetExercises);
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Activity className="text-fitness-red" />
          Treinos
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Sua rotina diária de exercícios
        </p>
        
        <div className="bg-fitness-gray-dark p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-semibold">Progresso do Treino</span>
            <span className="text-fitness-red font-bold">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full gradient-red transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-fitness-gray-light mt-2">
            {Math.round(progressPercentage)}% concluído
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6">
        {exercises.map((exercise, index) => (
          <Card 
            key={exercise.id}
            className={`
              glass-effect hover-lift cursor-pointer transition-all duration-300
              ${exercise.completed ? 'border-green-500 bg-green-500/10' : 'border-fitness-gray-dark'}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    p-3 rounded-full transition-all duration-300
                    ${exercise.completed ? 'bg-green-500' : 'bg-fitness-red'}
                  `}>
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`
                      text-xl font-semibold transition-all duration-300
                      ${exercise.completed ? 'text-green-400 line-through' : 'text-white'}
                    `}>
                      {exercise.name}
                    </h3>
                    <p className="text-fitness-gray-light">{exercise.sets}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => toggleExercise(exercise.id)}
                  variant={exercise.completed ? "default" : "outline"}
                  className={`
                    transition-all duration-300 hover:scale-105
                    ${exercise.completed 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white'
                    }
                  `}
                >
                  {exercise.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Concluído
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      Marcar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <div className="text-center space-y-4 animate-bounce-subtle">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-bold text-fitness-red">Treino Concluído!</h2>
          <p className="text-fitness-gray-light">Parabéns! Você completou todos os exercícios de hoje.</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={resetAll}
          variant="outline"
          className="border-fitness-gray-light text-fitness-gray-light hover:bg-fitness-gray-dark"
        >
          Resetar Treino
        </Button>
      </div>
    </div>
  );
};

export default Treinos;
