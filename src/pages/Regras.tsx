
import { useState, useEffect } from 'react';
import { Flame, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface Rule {
  id: string;
  text: string;
  emoji: string;
  description: string;
  completed: boolean;
}

const defaultRules: Rule[] = [
  {
    id: '1',
    text: 'Foto diária',
    emoji: '📸',
    description: 'Registre seu progresso todos os dias',
    completed: false
  },
  {
    id: '2',
    text: 'Sem pular treino',
    emoji: '🏋️‍♂️',
    description: 'Zero tolerância para preguiça',
    completed: false
  },
  {
    id: '3',
    text: 'Água 3-4L',
    emoji: '💧',
    description: 'Hidratação é vida, hidratação é resultado',
    completed: false
  },
  {
    id: '4',
    text: 'Alimentação limpa',
    emoji: '🥗',
    description: 'Só alimentos que constroem seu shape',
    completed: false
  },
  {
    id: '5',
    text: 'Sem açúcar, fritura, porcaria',
    emoji: '🚫',
    description: 'Elimine tudo que sabota seus resultados',
    completed: false
  }
];

const Regras = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    const savedRules = getFromStorage(StorageKeys.REGRAS, defaultRules);
    setRules(savedRules);
  }, []);

  const toggleRule = (id: string) => {
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, completed: !rule.completed } : rule
    );
    setRules(updatedRules);
    saveToStorage(StorageKeys.REGRAS, updatedRules);
  };

  const resetRules = () => {
    const resetRules = rules.map(rule => ({ ...rule, completed: false }));
    setRules(resetRules);
    saveToStorage(StorageKeys.REGRAS, resetRules);
  };

  const completedCount = rules.filter(rule => rule.completed).length;
  const totalCount = rules.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Flame className="text-fitness-red animate-pulse-strong" />
          Regras Mentais
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Disciplina absoluta para resultados insanos
        </p>
        
        <div className="bg-fitness-gray-dark p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-semibold">Disciplina Diária</span>
            <span className="text-fitness-red font-bold text-2xl">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full gradient-red transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-fitness-gray-light mt-2">
            {Math.round(progressPercentage)}% das regras seguidas hoje
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <Card 
            key={rule.id}
            className={`
              glass-effect hover-lift cursor-pointer transition-all duration-300
              ${rule.completed 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-fitness-red/50 hover:border-fitness-red'
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => toggleRule(rule.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    text-4xl transition-all duration-300
                    ${rule.completed ? 'grayscale-0 animate-bounce-subtle' : 'grayscale'}
                  `}>
                    {rule.emoji}
                  </div>
                  <div>
                    <h3 className={`
                      text-xl font-bold transition-all duration-300
                      ${rule.completed ? 'text-green-400 line-through' : 'text-white'}
                    `}>
                      {rule.text}
                    </h3>
                    <p className="text-fitness-gray-light text-sm mt-1">
                      {rule.description}
                    </p>
                  </div>
                </div>
                
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 hover:scale-110
                  ${rule.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-fitness-red hover:bg-fitness-red/20'
                  }
                `}>
                  {rule.completed && <CheckCircle className="h-5 w-5 text-white" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <div className="text-center space-y-4 animate-scale-in">
          <div className="text-6xl animate-bounce-subtle">🔥</div>
          <h2 className="text-3xl font-bold text-fitness-red">INSANO!</h2>
          <p className="text-fitness-gray-light text-lg">
            Você seguiu todas as regras hoje. Isso é disciplina de CAMPEÃO!
          </p>
          <div className="text-2xl">🏆👑🔥</div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={resetRules}
          variant="outline"
          className="border-fitness-gray-light text-fitness-gray-light hover:bg-fitness-gray-dark"
        >
          Resetar Dia
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect border-fitness-red/50">
          <CardHeader>
            <CardTitle className="text-fitness-red">💀 Mentalidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">"Não existe meio termo."</strong> Ou você segue 100% 
              das regras, ou você está sabotando seus resultados. Seja radical!
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-400">⚡ Lembrete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">28 dias decidem tudo.</strong> Cada dia que você 
              segue essas regras te aproxima do shape dos seus sonhos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Regras;
