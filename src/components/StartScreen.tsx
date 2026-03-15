interface Props { onStart: () => void; }

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-10">
      <h1 className="font-pixel text-2xl text-primary pixel-shadow mb-4">TaoTao Adventure</h1>
      <p className="font-body text-lg text-muted-foreground mb-8">
        一个需要一点技巧才能通关的小游戏。
      </p>
      <div className="font-body text-base text-foreground/80 mb-6 space-y-1 text-center">
        <p>移动：← →</p>
        <p>跳跃：空格</p>
        <p>冲刺：Shift</p>
        <p>交互：↑ / W</p>
      </div>
      <button
        onClick={onStart}
        className="font-pixel text-sm px-8 py-3 bg-primary text-primary-foreground hover:brightness-110 transition pixel-border"
      >
        开始冒险
      </button>
      <p className="font-body text-sm text-muted-foreground mt-8">
        "通关之后也许有奖励哦。"
      </p>
    </div>
  );
}
