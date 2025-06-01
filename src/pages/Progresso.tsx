
import { useState, useEffect } from 'react';
import { Star, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, StorageKeys, getProgressColor, calculateDayProgress } from '@/utils/storage';

interface ProgressStats {
  totalDays: number;
  completedDays: number;
  totalChecklists: number;
  completedChecklists: number;
  averageProgress: number;
  streak: number;
}

const Progresso = () => {
  const [stats, setStats] = useState<ProgressStats>({
    totalDays: 28,
    completedDays: 0,
    totalChecklists: 0,
    completedChecklists: 0,
    averageProgress: 0,
    streak: 0
  });

  useEffect(() => {
    const checkInData = getFromStorage(StorageKeys.CHECKIN, {});
    
    let completedDays = 0;
    let totalChecklists = 0;
    let completedChecklists = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    
    // Calculate stats for all 28 days
    for (let day = 1; day <= 28; day++) {
      const dayData = checkInData[day];
      if (dayData) {
        const dayProgress = calculateDayProgress(dayData);
        const dayCompleted = Object.values(dayData).filter(Boolean).length;
        const dayTotal = Object.values(dayData).length;
        
        totalChecklists += dayTotal;
        completedChecklists += dayCompleted;
        
        if (dayProgress === 100) {
          completedDays++;
          tempStreak++;
          currentStreak = Math.max(currentStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    }
    
    const averageProgress = totalChecklists > 0 ? (completedChecklists / totalChecklists) * 100 : 0;
    
    setStats({
      totalDays: 28,
      completedDays,
      totalChecklists,
      completedChecklists,
      averageProgress,
      streak: currentStreak
    });
  }, []);

  const overallProgress = (stats.completedDays / stats.totalDays) * 100;
  const progressColorClass = getProgressColor(overallProgress);

  const getMotivationalMessage = (): { message: string; emoji: string } => {
    if (overallProgress === 100) return { message: "VOCÊ É INSANO! COMPLETOU TUDO!", emoji: "👑" };
    if (overallProgress >= 90) return { message: "VOCÊ ESTÁ INSANO!", emoji: "🔥" };
    if (overallProgress >= 75) return { message: "FOCO TOTAL!", emoji: "💪" };
    if (overallProgress >= 50) return { message: "NO CAMINHO CERTO!", emoji: "🎯" };
    if (overallProgress >= 25) return { message: "CONTINUE LUTANDO!", emoji: "⚡" };
    return { message: "HORA DE COMEÇAR!", emoji: "💀" };
  };

  const { message, emoji } = getMotivationalMessage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Star className="text-fitness-red animate-pulse-strong" />
          Progresso Total
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Sua jornada rumo ao shape insano
        </p>
      </div>

      <Card className="glass-effect border-fitness-red hover-lift">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-white">Progresso Geral - 28 Dias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce-subtle">{emoji}</div>
            <h2 className="text-2xl font-bold text-fitness-red mb-4">{message}</h2>
            
            <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden mb-4">
              <div 
                className={`h-full ${progressColorClass} transition-all duration-1000 ease-out`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            
            <div className="text-3xl font-bold text-white">
              {Math.round(overallProgress)}%
            </div>
            <p className="text-fitness-gray-light">
              {stats.completedDays} de {stats.totalDays} dias completos
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-fitness-gray-dark hover-lift">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-fitness-red">
              {stats.completedDays}
            </div>
            <p className="text-fitness-gray-light text-sm">Dias Completos</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-fitness-gray-dark hover-lift">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.completedChecklists}
            </div>
            <p className="text-fitness-gray-light text-sm">Tarefas Completas</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-fitness-gray-dark hover-lift">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(stats.averageProgress)}%
            </div>
            <p className="text-fitness-gray-light text-sm">Média Geral</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-fitness-gray-dark hover-lift">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-400">
              {stats.streak}
            </div>
            <p className="text-fitness-gray-light text-sm">Sequência Máxima</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect border-fitness-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-fitness-red" />
              Estatísticas Detalhadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-fitness-gray-light">Total de Tarefas:</span>
              <span className="text-white font-bold">{stats.totalChecklists}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fitness-gray-light">Tarefas Realizadas:</span>
              <span className="text-green-400 font-bold">{stats.completedChecklists}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fitness-gray-light">Taxa de Sucesso:</span>
              <span className="text-fitness-red font-bold">
                {Math.round(stats.averageProgress)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-fitness-gray-light">Dias Restantes:</span>
              <span className="text-yellow-400 font-bold">
                {stats.totalDays - stats.completedDays}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-fitness-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-fitness-red" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`p-3 rounded-lg ${stats.completedDays >= 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <span>🥉</span>
                <span className="font-medium">Primeiro Dia Completo</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${stats.completedDays >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <span>🥈</span>
                <span className="font-medium">Uma Semana Forte</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${stats.completedDays >= 14 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <span>🥇</span>
                <span className="font-medium">Meio Caminho</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${stats.completedDays >= 28 ? 'bg-fitness-red/20 text-fitness-red' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <span>👑</span>
                <span className="font-medium">Shape Insano Conquistado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4 p-6 bg-fitness-gray-dark rounded-xl">
        <h3 className="text-2xl font-bold text-fitness-red">💀 Lembrete Final</h3>
        <p className="text-fitness-gray-light text-lg">
          {overallProgress < 100 ? (
            <>Ainda restam <strong className="text-white">{stats.totalDays - stats.completedDays} dias</strong> para completar sua transformação. Não desista agora!</>
          ) : (
            <>🎉 <strong className="text-fitness-red">PARABÉNS!</strong> Você completou os 28 dias de transformação insana! 🎉</>
          )}
        </p>
      </div>
    </div>
  );
};

export default Progresso;
