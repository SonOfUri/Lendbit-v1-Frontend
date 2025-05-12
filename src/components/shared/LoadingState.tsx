interface LoadingProps {
  size?: number; 
}

const LoadingState: React.FC<LoadingProps> = ({ size = 50 }) => {
  return (
    <div className="flex items-center justify-center h-full gap-6">
      <img
        src="/logo-icon.svg"
        alt="Loading..."
        style={{
          width: size,
          height: size,
        }}
        className="animate-spin"
      />
      <img
        src="/logo-text.svg"
        alt="Lendbit Text"
        className="hidden md:block w-[120px]"
      />
    </div>
  );
};

export default LoadingState;