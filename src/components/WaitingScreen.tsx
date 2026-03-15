interface Props { onComplete: () => void; }

export default function WaitingScreen({ onComplete }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background">
      <p className="font-pixel text-base text-foreground pixel-shadow mb-4">
        请涛涛闭上眼睛等待一下。
      </p>
      <p className="font-body text-lg text-muted-foreground mb-2">
        爽爽正在去拿你的生日礼物。
      </p>
      <p className="font-body text-lg text-accent animate-pulse mb-8">
        礼物准备中……
      </p>
      <button
        onClick={onComplete}
        className="font-pixel text-xs px-8 py-3 bg-accent text-accent-foreground pixel-border"
      >
        我拿到了
      </button>
    </div>
  );
}
