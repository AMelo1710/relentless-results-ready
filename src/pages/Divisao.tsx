
import { Clock, Sun, Sunset, Moon, Bed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeSlot {
  id: string;
  period: string;
  icon: any;
  time: string;
  activities: string[];
  color: string;
  bgColor: string;
}

const timeSlots: TimeSlot[] = [
  {
    id: 'manha',
    period: 'Manhã',
    icon: Sun,
    time: '06:00 - 12:00',
    activities: ['Treino Intenso', 'Refeição Limpa', 'Hidratação 1L'],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  {
    id: 'tarde',
    period: 'Tarde',
    icon: Sunset,
    time: '12:00 - 18:00',
    activities: ['Treino Moderado', 'Refeição Principal', 'Suplemento Caseiro'],
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  {
    id: 'noite',
    period: 'Noite',
    icon: Moon,
    time: '18:00 - 22:00',
    activities: ['Treino Leve', 'Refeição Leve', 'Relaxamento'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  {
    id: 'sono',
    period: 'Sono',
    icon: Bed,
    time: '22:00 - 06:00',
    activities: ['Descanso Completo', '7-8h de Sono', 'Recuperação Muscular'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  }
];

const Divisao = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Clock className="text-fitness-red" />
          Divisão do Dia
        </h1>
        <p className="text-fitness-gray-light text-lg">
          Cronograma otimizado para máximos resultados
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-fitness-red/30 rounded-full" />
        
        <div className="space-y-6">
          {timeSlots.map((slot, index) => (
            <div 
              key={slot.id}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 w-5 h-5 bg-fitness-red rounded-full border-4 border-fitness-black z-10" />
              
              <div className="ml-16">
                <Card className={`glass-effect hover-lift border-fitness-gray-dark ${slot.bgColor}`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <slot.icon className={`h-8 w-8 ${slot.color}`} />
                      <div>
                        <h3 className="text-2xl font-bold text-white">{slot.period}</h3>
                        <p className="text-fitness-gray-light text-sm">{slot.time}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {slot.activities.map((activity, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-3 p-3 bg-fitness-gray-dark/50 rounded-lg hover:bg-fitness-gray-dark/70 transition-all duration-300"
                        >
                          <div className="w-2 h-2 bg-fitness-red rounded-full flex-shrink-0" />
                          <span className="text-white font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="glass-effect border-fitness-red/50">
          <CardHeader>
            <CardTitle className="text-fitness-red flex items-center gap-2">
              ⚡ Regra de Ouro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">Consistência é tudo!</strong> Siga este cronograma 
              religiosamente por 28 dias. Pequenas ações diárias geram transformações insanas.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              💡 Dica Pro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fitness-gray-light">
              <strong className="text-white">Prepare tudo na noite anterior:</strong> roupas de treino, 
              suplementos, e refeições. Elimine qualquer desculpa para falhar.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4 p-6 bg-fitness-gray-dark rounded-xl">
        <h3 className="text-2xl font-bold text-fitness-red">🎯 Lembre-se</h3>
        <p className="text-fitness-gray-light text-lg">
          "A disciplina é a ponte entre metas e conquistas. Seja disciplinado, seja insano!"
        </p>
      </div>
    </div>
  );
};

export default Divisao;
