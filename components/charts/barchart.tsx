import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ICustomBarChartProps {
  categoryData: any;
}

const CustomBarChart: React.FC<ICustomBarChartProps> = ({ categoryData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="budget" fill="#e0e7ff" name="Budget" />
        <Bar dataKey="spent" fill="#8784d8" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
