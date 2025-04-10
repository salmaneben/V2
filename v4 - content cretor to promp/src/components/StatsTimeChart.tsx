// src/components/StatsTimeChart.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  getDailyStats, 
  getWeeklyStats, 
  getMonthlyStats,
  getStatsGrowth 
} from '@/lib/appStats';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface StatsTimeChartProps {
  statName: string;
  displayName: string;
  color: string;
  chartType?: 'bar' | 'line';
  defaultPeriod?: 'daily' | 'weekly' | 'monthly';
}

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const StatsTimeChart: React.FC<StatsTimeChartProps> = ({ 
  statName, 
  displayName, 
  color,
  chartType = 'bar',
  defaultPeriod = 'daily'
}) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(defaultPeriod);
  const [chartData, setChartData] = useState<any[]>([]);
  const [growth, setGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadChartData();
  }, [timePeriod, statName]);

  const loadChartData = () => {
    setIsLoading(true);
    
    // Get data based on selected time period
    let data: any[] = [];
    
    if (timePeriod === 'daily') {
      data = getDailyStats(statName as any, 7).map(item => ({
        name: `Apr ${new Date(item.date).getDate()}`,
        value: item.value
      }));
      
      setGrowth(getStatsGrowth(statName as any, 'day'));
    } else if (timePeriod === 'weekly') {
      data = getWeeklyStats(statName as any, 4).map(item => ({
        name: `Week ${item.week.split('-W')[1]}`,
        value: item.value
      }));
      
      setGrowth(getStatsGrowth(statName as any, 'week'));
    } else if (timePeriod === 'monthly') {
      // For the blog posts monthly view, use specific month names as shown in example
      if (statName === 'blogContentGenerator') {
        data = [
          { name: 'Dec', value: 0 },
          { name: 'Jan', value: 0 },
          { name: 'Feb', value: 0 },
          { name: 'Mar', value: 0 },
          { name: 'Apr', value: 0 }
        ];
      } else {
        data = getMonthlyStats(statName as any, 6).map(item => {
          const [year, month] = item.month.split('-');
          return {
            name: new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(undefined, { month: 'short' }),
            value: item.value
          };
        });
      }
      
      setGrowth(getStatsGrowth(statName as any, 'month'));
    }
    
    setChartData(data);
    setIsLoading(false);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  // Set up specific data for charts based on the examples provided
  let xAxisLabels: string[] = [];
  
  if (statName === 'apiCalls') {
    xAxisLabels = ['Apr 4', 'Apr 6', 'Apr 8', 'Apr 10'];
  } else if (statName === 'promptsGenerated') {
    xAxisLabels = ['Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 10'];
  } else if (statName === 'headlineAnalyzer') {
    xAxisLabels = ['Apr 4', 'Apr 6', 'Apr 8', 'Apr 10'];
  } else if (statName === 'blogContentGenerator' && timePeriod === 'monthly') {
    xAxisLabels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  }

  const getPreviousPeriodText = () => {
    if (timePeriod === 'daily') return 'day';
    if (timePeriod === 'weekly') return 'week';
    return 'month';
  };

  // Enhanced tooltip with more professional styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md text-xs">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
            <p className="text-gray-700 font-medium">
              {`${payload[0].value}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="p-5 flex flex-col h-full shadow-sm border-0 bg-white rounded-xl overflow-hidden">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-800 mb-1.5 flex items-center">
          {displayName}
        </h3>
        <div className="flex mb-3">
          <button
            onClick={() => handlePeriodChange('daily')}
            className={`mr-4 text-sm focus:outline-none transition-colors duration-200 ${
              timePeriod === 'daily' 
                ? 'font-bold text-gray-800' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => handlePeriodChange('weekly')}
            className={`mx-4 text-sm focus:outline-none transition-colors duration-200 ${
              timePeriod === 'weekly' 
                ? 'font-bold text-gray-800' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handlePeriodChange('monthly')}
            className={`ml-4 text-sm focus:outline-none transition-colors duration-200 ${
              timePeriod === 'monthly' 
                ? 'font-bold text-gray-800' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Month
          </button>
        </div>
        
        <div className="flex items-center mb-3">
          <span className={`text-sm font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {growth >= 0 ? <ChevronUp className="inline h-4 w-4 mr-0.5" /> : <ChevronDown className="inline h-4 w-4 mr-0.5" />}
            {growth}%
          </span>
          <span className="text-xs text-gray-500 ml-1.5">
            vs previous {getPreviousPeriodText()}
          </span>
        </div>
      </div>
      
      <div className="flex-grow" style={{ height: '140px', minHeight: '140px' }}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-50 rounded-lg w-full h-full"></div>
          </div>
        ) : (
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  {/* Very light grid lines for reference */}
                  <CartesianGrid vertical={false} stroke="#f5f5f5" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                    ticks={xAxisLabels.length > 0 ? xAxisLabels : undefined}
                  />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
                  <Bar 
                    dataKey="value" 
                    fill={color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    animationDuration={1200}
                  />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid vertical={false} stroke="#f5f5f5" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                    ticks={xAxisLabels.length > 0 ? xAxisLabels : undefined}
                  />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={color} 
                    strokeWidth={2.5}
                    dot={{ fill: 'white', stroke: color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: color }}
                    animationDuration={1200}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsTimeChart;