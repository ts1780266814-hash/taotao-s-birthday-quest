interface Props {
  stars: number;
  hiddenFound: number;
  deaths: number;
  explorationScore: number;
  performanceScore: number;
  quizzesCompleted: number;
  onComplete: () => void;
}

export default function SummaryScreen({ stars, hiddenFound, deaths, explorationScore, performanceScore, quizzesCompleted, onComplete }: Props) {
  const mainline = 40;
  const quizScore = Math.min(30, quizzesCompleted * 10);
  const explore = Math.min(20, explorationScore);
  const perf = Math.min(10, performanceScore);
  const total = mainline + quizScore + explore + perf;

  let eval_ = '';
  if (total >= 95) eval_ = '爽爽认证顶级玩家';
  else if (total >= 85) eval_ = '非常有实力';
  else if (total >= 70) eval_ = '顺利通关，表现不错';
  else eval_ = '虽然有点笨，但还是过来了';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background overflow-auto">
      <h2 className="font-pixel text-lg text-accent pixel-shadow mb-6">冒险结算</h2>
      
      <div className="font-body text-lg text-foreground space-y-2 mb-6 text-center">
        <p>主线通关：{mainline} / 40</p>
        <p>问题完成：{quizScore} / 30</p>
        <p>探索发现：{explore} / 20</p>
        <p>操作表现：{perf} / 10</p>
      </div>

      <p className="font-pixel text-sm text-primary pixel-shadow mb-2">
        涛涛冒险完成度：{total}%
      </p>
      <p className="font-body text-xl text-accent mb-6">{eval_}</p>

      <div className="font-body text-base text-muted-foreground space-y-1 mb-6 text-center">
        <p>星星碎片：{stars} / 7</p>
        <p>隐藏彩蛋：{hiddenFound} / 7</p>
        <p>重生次数：{deaths}</p>
      </div>

      <button
        onClick={onComplete}
        className="font-pixel text-xs px-8 py-3 bg-primary text-primary-foreground pixel-border"
      >
        查看最终奖励
      </button>
    </div>
  );
}
