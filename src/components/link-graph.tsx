import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { GenericId as Id } from 'convex/values';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  id: string;
}

interface ChartData {
  date: string;
  count: number;
}

function LinkGraph({ id }: Props) {
  console.log(id);
  const stats = useQuery(api.links.getLinkStats, {
    linkId: id as Id<'links'>,
    aggregateBy: 'day',
  });

  // Transform data for the chart
  const chartData: ChartData[] =
    stats?.aggregated?.map((item) => ({
      date: item.key,
      count: item.count,
    })) || [];

  console.log(chartData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Link Visits Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LinkGraph;
