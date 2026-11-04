'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Commission } from '@/types';
import { 
  CopilotMessage, 
  COPILOT_SUGGESTED_PROMPTS, 
  queryCopilot 
} from '@/lib/copilot/aiEngine';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: number;
  commissions: Commission[];
  onApplyAction: (action: NonNullable<CopilotMessage['suggestedAction']>) => void;
}

export function CopilotDrawer({
  isOpen,
  onClose,
  currentWeek,
  commissions,
  onApplyAction
}: CopilotDrawerProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      timestamp: 'Ahora',
      text: '¡Hola! Soy el **Copiloto de Decisión sobre Espacios** (Fase II · GenAI). Consulto mediante funciones seguras de solo lectura los datos de asignación, el motor de reglas y la asistencia histórica para explicarte alternativas y escenarios sin inventar datos. ¿En qué te puedo ayudar?',
      sourceCitations: ['Motor de Reglas Determinístico (Fase I)', 'Catálogo de 27 Espacios Sede Perón 830']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputValue;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simular tiempo de inferencia del LLM
    setTimeout(() => {
      const response = queryCopilot(q, currentWeek, commissions);
      setMessages(prev => [...prev, response]);
    }, 400);
  };

  return (
    <div className={`fixed right-0 top-0 bottom-0 z-50 bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ${
      isExpanded ? 'w-full md:w-[650px]' : 'w-full md:w-[480px]'
    }`}>
      {/* Header del Copiloto */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm tracking-tight">Copiloto de Espacios</h2>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-bold">
                GenAI · MIT 4-Stage
              </span>
            </div>
            <p className="text-[11px] text-purple-200">Explicaciones fundamentadas · Sede Perón 830</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-white/10"
            title={isExpanded ? 'Reducir' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-white/10"
            title="Cerrar Copiloto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sugerencias Rápidas */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Preguntas Clave:</span>
        {COPILOT_SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 text-[11px] font-semibold rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs ${
                isUser
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-slate-100/90 text-slate-900 rounded-tl-none border border-slate-200/80'
              }`}>
                {/* Texto formateado */}
                <div 
                  className="leading-relaxed whitespace-pre-line font-medium text-xs space-y-1"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />

                {/* Fuentes de Datos Citadas */}
                {msg.sourceCitations && msg.sourceCitations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-500" />
                      Fuentes verificadas del motor:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {msg.sourceCitations.map((cite, idx) => (
                        <li key={idx}>{cite}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Botón de Acción Sugerida */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2">
                    <button
                      onClick={() => onApplyAction(msg.suggestedAction!)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-xs transition-all text-xs"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-right mt-1 opacity-60">
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Chat */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregúntale al Copiloto sobre aulas, ocupación o conflictos..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          La IA interpreta y explica resultados; la Coordinación y Bedelía toman las decisiones finales.
        </p>
      </div>
    </div>
  );
}
