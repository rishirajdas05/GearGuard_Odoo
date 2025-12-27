import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { EQUIPMENT_CATEGORIES } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export function ReportsPage() {
  const { requests, teams, equipment } = useData();

  // Requests per team
  const requestsByTeam = teams.map(team => ({
    name: team.name,
    total: requests.filter(r => r.maintenanceTeamId === team.id).length,
    open: requests.filter(r => r.maintenanceTeamId === team.id && (r.stage === 'new' || r.stage === 'in_progress')).length,
    repaired: requests.filter(r => r.maintenanceTeamId === team.id && r.stage === 'repaired').length,
  }));

  // Requests per category
  const requestsByCategory = EQUIPMENT_CATEGORIES.map(cat => ({
    name: cat.label,
    value: requests.filter(r => r.equipmentCategory === cat.value).length,
  })).filter(c => c.value > 0);

  // Request type distribution
  const requestTypeData = [
    { name: 'Corrective', value: requests.filter(r => r.type === 'corrective').length },
    { name: 'Preventive', value: requests.filter(r => r.type === 'preventive').length },
  ];

  // Stage distribution
  const stageData = [
    { name: 'New', value: requests.filter(r => r.stage === 'new').length, color: 'hsl(199, 89%, 48%)' },
    { name: 'In Progress', value: requests.filter(r => r.stage === 'in_progress').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Repaired', value: requests.filter(r => r.stage === 'repaired').length, color: 'hsl(142, 76%, 36%)' },
    { name: 'Scrap', value: requests.filter(r => r.stage === 'scrap').length, color: 'hsl(0, 84%, 60%)' },
  ];

  const chartColors = ['hsl(199, 89%, 48%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 68%, 60%)', 'hsl(0, 84%, 60%)'];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reports" description="Maintenance analytics and insights" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Requests by Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByTeam} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                    {requestsByTeam.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Requests by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {requestsByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Request Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Request Type Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    <Cell fill="hsl(0, 84%, 60%)" />
                    <Cell fill="hsl(199, 89%, 48%)" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Team Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Team</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Total Requests</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Open</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Repaired</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {requestsByTeam.map(team => {
                  const completionRate = team.total > 0 
                    ? Math.round((team.repaired / team.total) * 100) 
                    : 0;
                  return (
                    <tr key={team.name} className="border-t border-border">
                      <td className="p-3 font-medium">{team.name}</td>
                      <td className="p-3 text-center">{team.total}</td>
                      <td className="p-3 text-center text-warning">{team.open}</td>
                      <td className="p-3 text-center text-success">{team.repaired}</td>
                      <td className="p-3 text-center">
                        <span className={completionRate >= 70 ? 'text-success' : completionRate >= 40 ? 'text-warning' : 'text-destructive'}>
                          {completionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}