
import { useState, useEffect } from 'react';
import { Nutrition, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface FoodCategory {
  id: string;
  title: string;
  foods: string[];
  emoji: string;
  description: string;
}

const foodCategories: FoodCategory[] = [
  {
    id: 'proteinas',
    title: 'Proteínas',
    foods: ['Frango', 'Carne Vermelha', 'Peixe', 'Patinho', 'Ovos', 'Queijo Cottage'],
    emoji: '🥩',
    description: 'Essenciais para construção muscular'
  },
  {
    id: 'carboidratos',
    title: 'Carboidratos',
    foods: ['Arroz', 'Batata', 'Mandioca', 'Aveia', 'Batata Doce', 'Quinoa'],
    emoji: '🍚',
    description: 'Energia para seus treinos'
  },
  {
    id: 'vegetais',
    title: 'Saladas e Vegetais',
    foods: ['Alface', 'Tomate', 'Pepino', 'Cenoura', 'Brócolis', 'Couve'],
    emoji: '🥗',
    description: 'Livres - coma à vontade'
  },
  {
    id: 'gorduras',
    title: 'Gorduras Boas',
    foods: ['Azeite Extra Virgem', 'Castanhas', 'Amendoim', 'Abacate', 'Nozes'],
    emoji: '🥜',
    description: 'Importantes para hormônios'
  }
];

const forbiddenFoods = [
  'Açúcar refinado', 'Refrigerantes', 'Frituras', 'Fast Food', 'Doces', 
  'Biscoitos', 'Salgadinhos', 'Álcool', 'Pão branco', 'Massa refinada'
];

const Alimentacao = () => {
  const [checkedFoods, setCheckedFoods] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedChecks = getFromStorage(StorageKeys.ALIMENTACAO, {});
    setCheckedFoods(savedChecks);
  }, []);

  const toggleFood = (foodId: string) => {
    const updated = { ...checkedFoods, [foodId]: !checkedFoods[foodId] };
    setCheckedFoods(updated);
    saveToStorage(StorageKeys.ALIMENTACAO, updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Nutrition className="text-fitness-red" />
          Alimentação
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Protocolo alimentar para resultados insanos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {foodCategories.map((category, index) => (
          <Card 
            key={category.id}
            className="glass-effect hover-lift border-fitness-gray-dark"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white">
                <span className="text-2xl">{category.emoji}</span>
                {category.title}
              </CardTitle>
              <p className="text-fitness-gray-light text-sm">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.foods.map((food) => {
                  const foodId = `${category.id}-${food}`;
                  const isChecked = checkedFoods[foodId] || false;
                  
                  return (
                    <div
                      key={food}
                      onClick={() => toggleFood(foodId)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg cursor-pointer
                        transition-all duration-300 hover:bg-fitness-red/20
                        ${isChecked ? 'bg-green-500/20 border border-green-500' : 'bg-fitness-gray-dark/50'}
                      `}
                    >
                      <span className={`font-medium ${isChecked ? 'text-green-400' : 'text-white'}`}>
                        {food}
                      </span>
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        transition-all duration-300
                        ${isChecked 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-fitness-gray-light hover:border-fitness-red'
                        }
                      `}>
                        {isChecked && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-effect border-red-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-400">
            <X className="h-6 w-6" />
            ❌ Alimentos Proibidos
          </CardTitle>
          <p className="text-fitness-gray-light text-sm">
            Evite completamente durante os 28 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {forbiddenFoods.map((food) => (
              <div
                key={food}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
              >
                <span className="text-red-400 font-medium text-sm">{food}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4 p-6 bg-fitness-gray-dark rounded-xl">
        <h3 className="text-xl font-bold text-fitness-red">💡 Dica Importante</h3>
        <p className="text-fitness-gray-light">
          Mantenha sempre água gelada por perto. Meta: 3-4 litros por dia.
          A hidratação é fundamental para a queima de gordura!
        </p>
      </div>
    </div>
  );
};

export default Alimentacao;
