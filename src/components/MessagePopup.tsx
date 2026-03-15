interface Props {
  text: string;
  onClose: () => void;
}

export default function MessagePopup({ text, onClose }: Props) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-12 z-20">
      <div
        className="pixel-border bg-card/95 px-6 py-4 max-w-md cursor-pointer"
        onClick={onClose}
      >
        <p className="font-body text-lg text-foreground">{text}</p>
        <p className="font-body text-sm text-muted-foreground mt-1 text-right">点击继续 ▶</p>
      </div>
    </div>
  );
}
