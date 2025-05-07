import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextStyle } from 'react-native';
import Card from '@/components/Card';
import { typography } from '@/constants/typography';
import { Colors } from '@/constants/colors';
import { BarChart, PieChart, LineChart, Calendar, Download, Filter, ChevronDown } from 'lucide-react-native';
import { useVesselStore } from '@/store/vessel-store';
import { useMaintenanceStore } from '@/store/maintenance-store';
import { useTripLogStore } from '@/store/trip-log-store';
import ReportChart from '@/components/ReportChart';
import Button from '@/components/Button';

// Convert typography styles to comply with TextStyle requirements
const typographyStyles = {
  h2: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    color: typography.h2.color,
    letterSpacing: typography.h2.letterSpacing,
    lineHeight: typography.h2.lineHeight,
  },
  h3: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as TextStyle['fontWeight'],
    color: typography.h3.color,
    letterSpacing: typography.h3.letterSpacing,
    lineHeight: typography.h3.lineHeight,
  },
  body: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as TextStyle['fontWeight'],
    color: typography.body.color,
    letterSpacing: typography.body.letterSpacing,
    lineHeight: typography.body.lineHeight,
  },
  bodySmall: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as TextStyle['fontWeight'],
    color: typography.bodySmall.color,
    letterSpacing: typography.bodySmall.letterSpacing,
    lineHeight: typography.bodySmall.lineHeight,
  }
};

// Report types for the filter
type ReportType = 'usage' | 'maintenance' | 'fuel' | 'expenses';
// Time period for the filter
type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';

export default function ReportsScreen() {
  const { vessels } = useVesselStore();
  const { items: maintenanceItems } = useMaintenanceStore();
  const { trips } = useTripLogStore();
  
  // State for filters
  const [selectedReport, setSelectedReport] = useState<ReportType>('usage');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [showReportFilter, setShowReportFilter] = useState(false);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  
  // Get the primary vessel (first one for demo purposes)
  const primaryVessel = vessels.length > 0 ? vessels[0] : null;
  
  // Helper function to get report title
  const getReportTitle = (type: ReportType): string => {
    switch (type) {
      case 'usage': return 'Vessel Usage';
      case 'maintenance': return 'Maintenance History';
      case 'fuel': return 'Fuel Consumption';
      case 'expenses': return 'Expenses Breakdown';
      default: return 'Report';
    }
  };
  
  // Helper function to get time period label
  const getTimePeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'quarter': return 'Last 3 Months';
      case 'year': return 'Last 12 Months';
      case 'all': return 'All Time';
      default: return 'Custom';
    }
  };
  
  // Generate mock data for charts based on selected report type
  const getChartData = () => {
    switch (selectedReport) {
      case 'usage':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              data: [2, 0, 4, 0, 3, 6, 5],
              color: Colors.primary,
            }
          ],
          unit: 'hours',
          total: 20,
        };
      case 'maintenance':
        return {
          labels: ['Engine', 'Hull', 'Electrical', 'Plumbing', 'Other'],
          datasets: [
            {
              data: [5, 2, 3, 1, 2],
              colors: [Colors.primary, Colors.secondary, Colors.warning, Colors.success, Colors.textSecondary],
            }
          ],
          unit: 'tasks',
          total: 13,
        };
      case 'fuel':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [50, 45, 60, 70, 55, 40],
              color: Colors.secondary,
            }
          ],
          unit: 'gallons',
          total: 320,
        };
      case 'expenses':
        return {
          labels: ['Fuel', 'Maintenance', 'Docking', 'Insurance', 'Other'],
          datasets: [
            {
              data: [35, 25, 20, 15, 5],
              colors: [Colors.secondary, Colors.primary, Colors.warning, Colors.success, Colors.textSecondary],
            }
          ],
          unit: '%',
          total: 100,
        };
      default:
        return {
          labels: [],
          datasets: [{ data: [] }],
          unit: '',
          total: 0,
        };
    }
  };
  
  // Get stats based on selected report type
  const getStats = () => {
    switch (selectedReport) {
      case 'usage':
        return [
          { label: 'Total Hours', value: '120 hrs' },
          { label: 'Avg Trip', value: '4.2 hrs' },
          { label: 'Longest Trip', value: '8.5 hrs' },
        ];
      case 'maintenance':
        return [
          { label: 'Completed', value: '24' },
          { label: 'Pending', value: '3' },
          { label: 'Avg Cost', value: '$245' },
        ];
      case 'fuel':
        return [
          { label: 'Total Used', value: '320 gal' },
          { label: 'Avg Cost', value: '$4.25/gal' },
          { label: 'Efficiency', value: '2.8 gal/hr' },
        ];
      case 'expenses':
        return [
          { label: 'Total', value: '$4,850' },
          { label: 'Monthly Avg', value: '$805' },
          { label: 'Per Trip', value: '$162' },
        ];
      default:
        return [];
    }
  };
  
  // Get recent activities based on selected report type
  const getRecentActivities = () => {
    switch (selectedReport) {
      case 'usage':
        return trips.slice(0, 3).map(trip => ({
          title: trip.title,
          date: trip.date,
          value: `${trip.duration} hrs`,
        }));
      case 'maintenance':
        return maintenanceItems.slice(0, 3).map(item => ({
          title: item.title,
          date: item.dueDate,
          value: item.status === 'completed' ? 'Completed' : 'Pending',
        }));
      case 'fuel':
        return [
          { title: 'Refueled at Marina Bay', date: 'Jun 20, 2023', value: '45 gal' },
          { title: 'Refueled at Harbor Point', date: 'Jun 10, 2023', value: '38 gal' },
          { title: 'Refueled at Sunset Dock', date: 'May 28, 2023', value: '42 gal' },
        ];
      case 'expenses':
        return [
          { title: 'Annual Insurance', date: 'Jun 15, 2023', value: '$1,200' },
          { title: 'Engine Maintenance', date: 'Jun 5, 2023', value: '$450' },
          { title: 'Dock Fees', date: 'Jun 1, 2023', value: '$350' },
        ];
      default:
        return [];
    }
  };
  
  // Chart data
  const chartData = getChartData();
  const stats = getStats();
  const recentActivities = getRecentActivities();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typographyStyles.h2}>Reports</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.filters}>
          <View style={styles.filterContainer}>
            <Text style={typographyStyles.bodySmall}>Report Type</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowReportFilter(!showReportFilter)}
            >
              <Text style={styles.filterButtonText}>{getReportTitle(selectedReport)}</Text>
              <ChevronDown size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            {showReportFilter && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedReport('usage');
                    setShowReportFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedReport === 'usage' && styles.selectedFilterOption
                  ]}>
                    Vessel Usage
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedReport('maintenance');
                    setShowReportFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedReport === 'maintenance' && styles.selectedFilterOption
                  ]}>
                    Maintenance History
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedReport('fuel');
                    setShowReportFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedReport === 'fuel' && styles.selectedFilterOption
                  ]}>
                    Fuel Consumption
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedReport('expenses');
                    setShowReportFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedReport === 'expenses' && styles.selectedFilterOption
                  ]}>
                    Expenses Breakdown
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.filterContainer}>
            <Text style={typographyStyles.bodySmall}>Time Period</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowTimeFilter(!showTimeFilter)}
            >
              <Text style={styles.filterButtonText}>{getTimePeriodLabel(timePeriod)}</Text>
              <ChevronDown size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            {showTimeFilter && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setTimePeriod('week');
                    setShowTimeFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    timePeriod === 'week' && styles.selectedFilterOption
                  ]}>
                    Last 7 Days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setTimePeriod('month');
                    setShowTimeFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    timePeriod === 'month' && styles.selectedFilterOption
                  ]}>
                    Last 30 Days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setTimePeriod('quarter');
                    setShowTimeFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    timePeriod === 'quarter' && styles.selectedFilterOption
                  ]}>
                    Last 3 Months
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setTimePeriod('year');
                    setShowTimeFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    timePeriod === 'year' && styles.selectedFilterOption
                  ]}>
                    Last 12 Months
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.filterOption}
                  onPress={() => {
                    setTimePeriod('all');
                    setShowTimeFilter(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    timePeriod === 'all' && styles.selectedFilterOption
                  ]}>
                    All Time
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <Card style={styles.chartCard}>
          <Text style={typographyStyles.h3}>{getReportTitle(selectedReport)}</Text>
          <Text style={styles.chartSubtitle}>{getTimePeriodLabel(timePeriod)}</Text>
          
          <View style={styles.chartContainer}>
            <ReportChart 
              type={selectedReport === 'maintenance' || selectedReport === 'expenses' ? 'pie' : 'bar'}
              data={chartData}
            />
          </View>
          
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>
        
        <Card style={styles.activitiesCard}>
          <Text style={typographyStyles.h3}>Recent Activities</Text>
          
          {recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={typographyStyles.body}>{activity.title}</Text>
                <Text style={typographyStyles.bodySmall}>{activity.date}</Text>
              </View>
              <Text style={styles.activityValue}>{activity.value}</Text>
            </View>
          ))}
          
          <Button 
            title={`View All ${getReportTitle(selectedReport)}`}
            variant="outline"
            onPress={() => {}}
            style={styles.viewAllButton}
          />
        </Card>
        
        <Card style={styles.exportCard}>
          <View style={styles.exportHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={[typographyStyles.h3, styles.exportTitle]}>Export Report</Text>
          </View>
          
          <Text style={[typographyStyles.body, styles.exportDescription]}>
            Download a detailed report of your {getReportTitle(selectedReport).toLowerCase()} for the selected time period.
          </Text>
          
          <View style={styles.exportButtons}>
            <Button 
              title="PDF"
              variant="outline"
              onPress={() => {}}
              style={styles.exportButton}
            />
            <Button 
              title="CSV"
              variant="outline"
              onPress={() => {}}
              style={styles.exportButton}
            />
            <Button 
              title="Email"
              variant="outline"
              onPress={() => {}}
              style={styles.exportButton}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  filterButtonText: {
    fontSize: 16, 
    fontWeight: "500" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    letterSpacing: 0.15,
  },
  filterDropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  filterOptionText: {
    fontSize: 16, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    letterSpacing: 0.15,
  },
  selectedFilterOption: {
    color: Colors.primary,
    fontWeight: "600" as TextStyle['fontWeight'],
  },
  chartCard: {
    marginBottom: 16,
  },
  chartSubtitle: {
    fontSize: 16, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    letterSpacing: 0.15,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  chartContainer: {
    marginVertical: 16,
    height: 220,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18, 
    fontWeight: "700" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14, 
    fontWeight: "400" as TextStyle['fontWeight'], 
    lineHeight: 20, 
    color: Colors.textSecondary,
  },
  activitiesCard: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityValue: {
    fontSize: 16, 
    fontWeight: "600" as TextStyle['fontWeight'], 
    lineHeight: 24, 
    color: Colors.primary,
  },
  viewAllButton: {
    marginTop: 16,
  },
  exportCard: {
    marginBottom: 24,
  },
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportTitle: {
    marginLeft: 8,
  },
  exportDescription: {
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});