import { useState } from 'react';

interface Props { onComplete: () => void; }

const steps = [
  {
    npc: '哇，真没想到你能闯关完成。',
    choices: ['嘿嘿，我厉害吧。', '你设计的游戏真不错。'],
    correct: 1,
    wrongFeedback: '不对，再想想该说什么。',
  },
  {
    npc: '我设计的这么厉害的游戏都被你破解了，有点实力嘛。',
    choices: ['那当然，我可是天赋异禀。', '爽爽设计的游戏实在太厉害了，我费了九牛二虎之力才过来。'],
    correct: 1,
    wrongFeedback: '还不够，再给你一次机会。',
  },
  {
    npc: '好了，既然你都这么费劲心思来找我要礼物了。\n那就祝涛涛生日快乐吧。\n现在请你闭上眼睛，我给你去拿礼物了。',
    choices: null,
    correct: -1,
    wrongFeedback: '',
    button: '我闭眼了',
  },
];

export default function DialogueScreen({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [wrongMsg, setWrongMsg] = useState('');

  const current = steps[step];

  const handleChoice = (i: number) => {
    if (i === current.correct) {
      setWrongMsg('');
      if (step < steps.length - 1) {
        setStep(step + 1);
      }
    } else {
      setWrongMsg(current.wrongFeedback);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/95">
      <div className="pixel-border bg-card p-6 max-w-lg w-full">
        <p className="font-body text-xl text-foreground whitespace-pre-line mb-4">{current.npc}</p>
        
        {wrongMsg && (
          <p className="font-body text-base text-primary mb-3">{wrongMsg}</p>
        )}

        {current.choices ? (
          <div className="space-y-2">
            {current.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="w-full text-left font-body text-lg px-4 py-2 border-2 border-border hover:bg-accent hover:text-accent-foreground transition"
              >
                {i + 1}. {c}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="w-full font-pixel text-xs py-2 bg-primary text-primary-foreground pixel-border"
          >
            {current.button}
          </button>
        )}
      </div>
    </div>
  );
}
