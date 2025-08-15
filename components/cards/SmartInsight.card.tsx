import { Brain, Target, AlertCircle, Lightbulb } from "lucide-react";

import { Badge } from "../../components/ui/badge";

interface ISmartInsightCardProps {
  insight: any;
}
const SmartInsightCard: React.FC<ISmartInsightCardProps> = ({ insight }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "tip":
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Target className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "alert":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-orange-200 bg-orange-50";
      case "tip":
        return "border-blue-200 bg-blue-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-purple-200 bg-purple-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-blue-100 text-blue-800",
    };
    
    return colors[priority as keyof typeof colors] || colors.low;
  };


  return (
    <div className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
      <div className="flex items-start gap-3">
        {getInsightIcon(insight.type)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{insight.title}</h4>
            <Badge className={getPriorityBadge(insight.priority)}>
              {insight.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
          <p className="text-sm font-medium text-gray-800">{insight.action}</p>
        </div>
      </div>
    </div>
  );
};

export default SmartInsightCard;
