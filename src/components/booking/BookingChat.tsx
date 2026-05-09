import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-atendimento`;
const AUTH = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

const SUGESTOES = [
  "Quanto custa higienizar um sofá de 3 lugares?",
  "Vocês atendem em Vespasiano?",
  "O produto é seguro para bebê?",
  "Quanto tempo demora a limpeza?",
];

export function BookingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Oi! 👋 Sou a assistente da AutoLimpezaPro. Posso te ajudar com dúvidas sobre serviços, preços e horários. Como posso ajudar?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: AUTH },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (resp.status === 429) {
        toast.error("Muitas mensagens. Aguarde uns segundos.");
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("Créditos de IA esgotados. Avise o administrador.");
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast.error("Não consegui responder agora. Tente novamente.");
        setLoading(false);
        return;
      }

      // Empurra mensagem vazia da assistente e vai preenchendo
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      let done = false;

      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistantText };
                return next;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-[85] h-14 w-14 rounded-full bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform animate-fade-in"
          aria-label="Abrir chat de atendimento"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
          </div>
        </button>
      )}

      {/* Painel */}
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full sm:max-w-md h-[85vh] sm:h-[600px] sm:rounded-2xl rounded-t-2xl bg-card border border-border flex flex-col overflow-hidden animate-slide-in-bottom">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground px-4 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Atendimento AutoLimpezaPro</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Online agora
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full hover:bg-white/20 flex items-center justify-center"
                aria-label="Fechar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap break-words ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.content || (
                      <Loader2 className="h-4 w-4 animate-spin opacity-60" />
                    )}
                  </div>
                </div>
              ))}

              {/* Sugestões iniciais */}
              {messages.length === 1 && !loading && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground px-1">Sugestões:</p>
                  {SUGESTOES.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-sm px-3 py-2 rounded-xl border border-border hover:bg-muted transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border p-3 flex items-center gap-2 bg-card safe-bottom"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua dúvida..."
                disabled={loading}
                className="flex-1 h-11 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
                aria-label="Enviar"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
