import { TrendingUp, TrendingDown } from "lucide-react";

interface ISpendingPredictionCardProps {
  prediction: any;
}

const SpendingPredictionCard: React.FC<ISpendingPredictionCardProps> = ({
  prediction,
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{prediction.title}</h4>
        {prediction.trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-red-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-green-500" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Current:</span>
          <span className="font-medium">{prediction.current.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Predicted:</span>
          <span
            className={`font-medium ${
              prediction.trend === "up" ? "text-red-600" : "text-green-600"
            }`}
          >
            {prediction.predicted.toFixed(2)}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-3">
        {prediction.description}
      </p>
    </div>
  );
};

export default SpendingPredictionCard;
