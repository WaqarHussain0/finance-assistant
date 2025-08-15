import {
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface ICustomLineChartProps {
  dailySpending: any[];
}

const CustomLineChart: React.FC<ICustomLineChartProps> = ({
  dailySpending,
}) => {
  // Group by date and sum amounts (absolute value for expenses)
  const aggregatedData = Object.values(
    dailySpending.reduce((acc, tx) => {
      const date = tx.date;
      if (!acc[date]) {
        acc[date] = { date, amount: 0 };
      }
      acc[date].amount += Math.abs(tx.amount); // make positive
      return acc;
    }, {} as Record<string, { date: string; amount: number }>)
  );

  // Sort by date for proper chart display
  aggregatedData.sort((a: any, b: any) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={aggregatedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value}`, "Spent"]} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
