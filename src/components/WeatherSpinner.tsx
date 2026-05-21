import '../styles/WeatherSpinner.css';

export const WeatherSpinner: React.FC = () => {
  return (
    <div className="spinner-wrap">
      <div className="spinner-rings">
        <div className="ring r1"></div>
        <div className="ring r2"></div>
        <div className="ring r3"></div>
      </div>
    </div>
  );
};

