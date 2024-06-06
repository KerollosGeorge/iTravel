import "./Loading.css";

export const Loading = () => {
  return (
    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  );
};
