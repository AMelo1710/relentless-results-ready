
import { useState, useEffect } from 'react';
import { Heart, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface Supplement {
  id: string;
  name: string;
  ingredients: string[];
  preparation: string[];
  madeTodayDates: string[];
}

const supplements: Supplement[] = [
  {
    id: '1',
    name: '🔥 Queimador Natural',
    ingredients: ['1 limão espremido', '1 colher de gengibre ralado', '1 pepino', '500ml água gelada', 'Folhas de hortelã'],
    preparation: ['Bata todos os ingredientes no liquidificador', 'Coe se preferir', 'Tome em jejum'],
    madeTodayDates: []
  },
  {
    id: '2',
    name: '💪 Pré-Treino Caseiro',
    ingredients: ['1 banana', '1 colher de aveia', '1 colher de mel', '200ml água de coco', 'Canela em pó'],
    preparation: ['Misture todos os ingredientes', 'Bata no liquidificador', 'Tome 30min antes do treino'],
    madeTodayDates: []
  },
  {
    id: '3',
    name: '🌟 Pós-Treino Recovery',
    ingredients: ['1 copo de leite', '1 banana', '1 colher de aveia', '1 colher de cacau em pó', 'Gelo'],
    preparation: ['Bata tudo no liquidificador', 'Adicione gelo a gosto', 'Tome até 30min após o treino'],
    madeTodayDates: []
  },
  {
    id: '4',
    name: '🧘 Detox Noturno',
    ingredients: ['1 maçã', '1 cenoura', '1 pedaço de gengibre', '200ml água', 'Folhas de couve'],
    preparation: ['Bata todos os ingredientes', 'Coe se necessário', 'Tome 2h antes de dormir'],
    madeTodayDates: []
  },
  {
    id: '5',
    name: '⚡ Energia Natural',
    ingredients: ['1 beterraba', '1 maçã', '1 cenoura', '1 laranja', 'Gengibre a gosto'],
    preparation: ['Extraia o suco de todos os ingredientes', 'Misture bem', 'Tome pela manhã'],
    madeTodayDates: []
  }
];

const Suplementos = () => {
  const [supplementData, setSupplementData] = useState<Supplement[]>([]);

  useEffect(() => {
    const savedData = getFromStorage(StorageKeys.SUPLEMENTOS, supplements);
    setSupplementData(savedData);
  }, []);

  const toggleMadeToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = supplementData.map(supplement => {
      if (supplement.id === id) {
        const madeTodayDates = supplement.madeTodayDates.includes(today)
          ? supplement.madeTodayDates.filter(date => date !== today)
          : [...supplement.madeTodayDates, today];
        return { ...supplement, madeTodayDates };
      }
      return supplement;
    });
    setSupplementData(updated);
    saveToStorage(StorageKeys.SUPLEMENTOS, updated);
  };

  const isMadeToday = (supplement: Supplement): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return supplement.madeTodayDates.includes(today);
  };

  const todayCount = supplementData.filter(isMadeToday).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Heart className="text-fitness-red" />
          Suplementos Caseiros
        </h1>
        <p className="text-fitness-gray-light text-lg">
          5 receitas naturais para potencializar seus resultados
        </p>
        
        <div className="bg-fitness-gray-dark p-4 rounded-xl">
          <div className="text-2xl font-bold text-fitness-red">{todayCount}/5</div>
          <p className="text-fitness-gray-light text-sm">Suplementos feitos hoje</p>
        </div>
      </div>

      <div className="space-y-6">
        {supplementData.map((supplement, index) => {
          const madeToday = isMadeToday(supplement);
          
          return (
            <Card 
              key={supplement.id}
              className={`
                glass-effect hover-lift transition-all duration-300
                ${madeToday ? 'border-green-500 bg-green-500/10' : 'border-fitness-gray-dark'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white text-xl">{supplement.name}</span>
                  <Button
                    onClick={() => toggleMadeToday(supplement.id)}
                    variant={madeToday ? "default" : "outline"}
                    className={`
                      transition-all duration-300 hover:scale-105
                      ${madeToday 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white'
                      }
                    `}
                  >
                    {madeToday ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Feito!
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 mr-2" />
                        Fazer
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-fitness-red mb-2">🥤 Ingredientes:</h4>
                  <ul className="space-y-1">
                    {supplement.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-fitness-gray-light flex items-center gap-2">
                        <span className="w-2 h-2 bg-fitness-red rounded-full flex-shrink-0" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-fitness-red mb-2">📝 Modo de Preparo:</h4>
                  <ol className="space-y-1">
                    {supplement.preparation.map((step, i) => (
                      <li key={i} className="text-fitness-gray-light flex items-start gap-2">
                        <span className="bg-fitness-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {supplement.madeTodayDates.length > 0 && (
                  <div className="text-center pt-2">
                    <span className="text-green-400 text-sm">
                      ✅ Feito {supplement.madeTodayDates.length} vez(es)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {todayCount === 5 && (
        <div className="text-center space-y-4 animate-pulse-strong">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-bold text-fitness-red">Dia Completo!</h2>
          <p className="text-fitness-gray-light">
            Parabéns! Você fez todos os suplementos de hoje. Seu corpo agradece!
          </p>
        </div>
      )}
    </div>
  );
};

export default Suplementos;
