import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface ChartDataset {
  data: number[];
  color?: string;
  colors?: string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  unit: string;
  total: number;
}

interface ReportChartProps {
  type: 'bar' | 'line' | 'pie';
  data: ChartData;
}

export default function ReportChart({ type, data }: ReportChartProps) {
  const { width } = Dimensions.get('window');
  const chartWidth = width - 80; // Account for padding
  
  if (type === 'pie') {
    return (
      <View style={styles.pieContainer}>
        <View style={styles.pieChart}>
          {data.datasets[0].data.map((value, index) => {
            const percentage = (value / data.total) * 100;
            const color = data.datasets[0].colors?.[index] || Colors.primary;
            
            return (
              <View key={index} style={styles.pieSegmentContainer}>
                <View 
                  style={[
                    styles.pieSegment, 
                    { 
                      backgroundColor: color,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                    }
                  ]} 
                />
                <View style={styles.pieLabel}>
                  <Text style={styles.pieLabelText}>{data.labels[index]}</Text>
                  <Text style={styles.pieValueText}>{percentage.toFixed(0)}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  
  // Bar chart (default)
  const maxValue = Math.max(...data.datasets[0].data);
  const barWidth = chartWidth / data.labels.length - 10;
  
  return (
    <View style={styles.barContainer}>
      <View style={styles.barChart}>
        {data.datasets[0].data.map((value, index) => {
          const barHeight = (value / maxValue) * 150;
          const color = data.datasets[0].color || Colors.primary;
          
          return (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      backgroundColor: color,
                      width: barWidth,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{data.labels[index]}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.yAxis}>
        <Text style={styles.axisLabel}>{maxValue}</Text>
        <Text style={styles.axisLabel}>{Math.round(maxValue / 2)}</Text>
        <Text style={styles.axisLabel}>0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    height: 180,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 12, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 16, 
    letterSpacing: 0.4,
    marginTop: 8,
    color: Colors.textSecondary,
  },
  yAxis: {
    width: 30,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  axisLabel: {
    fontSize: 12, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 16, 
    letterSpacing: 0.4,
    color: Colors.textSecondary,
  },
  pieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  pieChart: {
    justifyContent: 'center',
  },
  pieSegmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  pieSegment: {
    marginRight: 12,
  },
  pieLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: 200,
  },
  pieLabelText: {
    fontSize: 16, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    letterSpacing: 0.15,
  },
  pieValueText: {
    fontSize: 16, 
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24, 
    letterSpacing: 0.15,
  },
});