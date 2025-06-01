
import { useState, useEffect } from 'react';
import { Trophy, Edit3, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveToStorage, getFromStorage, StorageKeys } from '@/utils/storage';

interface Goal {
  title: string;
  description: string;
  personalGoal: string;
}

const defaultGoal: Goal = {
  title: "Shape Insano em 28 Dias",
  description: "Transformação completa através de disciplina absoluta. Queima de gordura, definição muscular e desenvolvimento de uma mentalidade invencível.",
  personalGoal: ""
};

const Metas = () => {
  const [goal, setGoal] = useState<Goal>(defaultGoal);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const savedGoal = getFromStorage(StorageKeys.METAS, defaultGoal);
    setGoal(savedGoal);
    setEditText(savedGoal.personalGoal);
  }, []);

  const handleSavePersonalGoal = () => {
    const updatedGoal = { ...goal, personalGoal: editText };
    setGoal(updatedGoal);
    saveToStorage(StorageKeys.METAS, updatedGoal);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(goal.personalGoal);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Trophy className="text-fitness-red animate-pulse-strong" />
          Metas
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Defina seu destino e conquiste o impossível
        </p>
      </div>

      <Card className="glass-effect border-fitness-red hover-lift">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold gradient-red bg-clip-text text-transparent">
            {goal.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce-subtle">🎯</div>
            <p className="text-fitness-gray-light text-lg leading-relaxed">
              {goal.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-fitness-red/20 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-fitness-red font-bold">Queima</div>
              <div className="text-fitness-gray-light text-sm">Gordura</div>
            </div>
            <div className="text-center p-4 bg-fitness-red/20 rounded-lg">
              <div className="text-2xl mb-2">💪</div>
              <div className="text-fitness-red font-bold">Definição</div>
              <div className="text-fitness-gray-light text-sm">Muscular</div>
            </div>
            <div className="text-center p-4 bg-fitness-red/20 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-fitness-red font-bold">Disciplina</div>
              <div className="text-fitness-gray-light text-sm">Mental</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-fitness-gray-dark">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-fitness-red" />
              Sua Meta Personalizada
            </span>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Descreva sua meta pessoal... Ex: 'Quero perder 10kg e conquistar o abdômen que sempre sonhei...'"
                className="min-h-32 bg-fitness-gray-dark border-fitness-gray-light text-white placeholder:text-fitness-gray-light"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleSavePersonalGoal}
                  className="bg-fitness-red hover:bg-fitness-red-dark text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-fitness-gray-light text-fitness-gray-light hover:bg-fitness-gray-dark"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {goal.personalGoal ? (
                <div className="p-4 bg-fitness-gray-dark/50 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{goal.personalGoal}</p>
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-fitness-gray-light rounded-lg">
                  <div className="text-4xl mb-3">✍️</div>
                  <p className="text-fitness-gray-light">
                    Clique em "Editar" para definir sua meta personalizada
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              💡 Dica de Ouro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">Visualize diariamente:</strong> Imagine-se já com 
              o shape dos seus sonhos. Sinta a confiança, veja as pessoas olhando. 
              A mente cria a realidade!
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              🎯 Estratégia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">Metas específicas vencem:</strong> Não diga "quero 
              emagrecer". Diga "quero perder 8kg e definir o abdômen em 28 dias". 
              Seja específico, seja implacável!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4 p-6 bg-fitness-gray-dark rounded-xl">
        <h3 className="text-2xl font-bold text-fitness-red">🔥 Mantra Diário</h3>
        <p className="text-white text-xl font-semibold">
          "Eu sou disciplinado. Eu sou focado. Eu sou INSANO!"
        </p>
        <p className="text-fitness-gray-light">
          Repita isso todos os dias. Suas ações seguem seus pensamentos.
        </p>
      </div>
    </div>
  );
};

export default Metas;
