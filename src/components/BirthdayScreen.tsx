export default function BirthdayScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background">
      <h1 className="font-pixel text-xl text-primary pixel-shadow mb-6 text-center leading-relaxed">
        祝涛涛23岁大寿<br />生日快乐
      </h1>
      <p className="font-body text-lg text-foreground mb-2">
        你已经成功通关《涛涛大冒险》
      </p>
      <p className="font-body text-lg text-accent">
        本次奖励已由爽爽亲自发放。
      </p>
      
      {/* Stars decoration */}
      <div className="mt-8 flex gap-3">
        {[...Array(7)].map((_, i) => (
          <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>★</span>
        ))}
      </div>
    </div>
  );
}
