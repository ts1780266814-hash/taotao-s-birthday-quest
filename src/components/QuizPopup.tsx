import { useState } from 'react';
import { Quiz } from '@/game/types';

interface Props {
  quiz: Quiz;
  onCorrect: () => void;
  onQuiz2Wrong: () => void;
}

export default function QuizPopup({ quiz, onCorrect, onQuiz2Wrong }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [wrong, setWrong] = useState(false);
  const [quiz2WrongStep, setQuiz2WrongStep] = useState(0); // 0=not wrong, 1=show penalty, 2=done

  const handleSubmit = () => {
    if (quiz.type === 'choice') {
      if (selected === quiz.correctAnswer) {
        onCorrect();
      } else {
        setWrong(true);
        setTimeout(() => setWrong(false), 1500);
      }
    } else {
      if (inputVal.trim() === quiz.correctAnswer) {
        onCorrect();
      } else {
        if (quiz.id === 'quiz2') {
          setQuiz2WrongStep(1);
        } else {
          setWrong(true);
          setTimeout(() => setWrong(false), 1500);
        }
      }
    }
  };

  if (quiz2WrongStep === 1) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/90">
        <div className="pixel-border bg-card p-6 max-w-sm text-center">
          <h3 className="font-pixel text-sm text-primary mb-4">验证失败</h3>
          <p className="font-body text-lg text-foreground mb-2">回答错误。</p>
          <p className="font-body text-lg text-foreground mb-4">
            根据本关特殊规定，你需要亲爽爽一口。
          </p>
          <p className="font-body text-base text-muted-foreground mb-4">
            若已完成，请点击【已完成继续】。
          </p>
          <button
            onClick={() => {
              setQuiz2WrongStep(2);
            }}
            className="font-pixel text-xs px-6 py-2 bg-accent text-accent-foreground pixel-border"
          >
            已完成继续
          </button>
        </div>
      </div>
    );
  }

  if (quiz2WrongStep === 2) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/90">
        <div className="pixel-border bg-card p-6 max-w-sm text-center">
          <p className="font-body text-lg text-foreground mb-4">勉强放你继续爬。</p>
          <button
            onClick={onQuiz2Wrong}
            className="font-pixel text-xs px-6 py-2 bg-primary text-primary-foreground pixel-border"
          >
            继续
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/90">
      <div className="pixel-border bg-card p-6 max-w-md w-full">
        {quiz.title && (
          <h3 className="font-pixel text-sm text-accent mb-3 text-center">{quiz.title}</h3>
        )}
        <p className="font-body text-xl text-foreground mb-4 text-center">{quiz.question}</p>
        
        {wrong && (
          <p className="font-body text-base text-primary mb-3 text-center">{quiz.wrongFeedback || '再想想！'}</p>
        )}

        {quiz.type === 'choice' && quiz.choices && (
          <div className="space-y-2 mb-4">
            {quiz.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left font-body text-lg px-4 py-2 border-2 transition
                  ${selected === i ? 'bg-accent text-accent-foreground border-accent' : 'bg-card text-foreground border-border hover:border-accent'}`}
              >
                {String.fromCharCode(65 + i)}. {c}
              </button>
            ))}
          </div>
        )}

        {quiz.type === 'input' && (
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="请输入答案"
            className="w-full font-body text-lg px-4 py-2 bg-muted text-foreground border-2 border-border mb-4 outline-none focus:border-accent"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full font-pixel text-xs py-2 bg-primary text-primary-foreground pixel-border hover:brightness-110"
        >
          确认
        </button>
      </div>
    </div>
  );
}
