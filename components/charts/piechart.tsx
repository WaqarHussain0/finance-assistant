import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface ICustomPieChartProps {
  categoryData: any;
}

const CustomPieChart: React.FC<ICustomPieChartProps> = ({ categoryData }) => {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];
  const filteredData = categoryData.filter((d: any) => d.spent > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="spent"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {filteredData.map((_: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, "Spent"]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
