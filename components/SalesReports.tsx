import React, { useMemo } from 'react';

interface Order {
  id: string;
  total: number;
  status: 'pending' | 'completed';
  itemName: string;
  source: string;
  timestamp: string;
  quantity: number;
}

interface SalesReportsProps {
  orders: Order[];
}

const SalesReports: React.FC<SalesReportsProps> = ({ orders }) => {
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const pendingOrders = orders.filter(o => o.status === 'pending');

    const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingRevenue = pendingOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    
    // Source analysis
    const sourceCounts: Record<string, number> = {};
    const sourceRevenue: Record<string, number> = {};
    
    // Item analysis
    const itemCounts: Record<string, number> = {};

    orders.forEach(order => {
      // Source stats
      const src = order.source || 'Unknown';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      if (order.status === 'completed') {
        sourceRevenue[src] = (sourceRevenue[src] || 0) + (order.total || 0);
      }

      // Item stats
      const item = order.itemName || 'Unknown';
      itemCounts[item] = (itemCounts[item] || 0) + (order.quantity || 1);
    });

    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalRevenue,
      pendingRevenue,
      completedCount: completedOrders.length,
      pendingCount: pendingOrders.length,
      topItems,
      sources,
      avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
    };
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Sales Reports</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Performance insights and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-emerald-500 tracking-tight">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">Paid & Completed</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pipeline</p>
          <p className="text-2xl font-black text-indigo-500 tracking-tight">${stats.pendingRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">Pending Orders</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.completedCount}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">{stats.pendingCount} pending</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Value</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">${stats.avgOrderValue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">Per Completed Order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Items */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 text-lg mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {stats.topItems.map(([name, count], index) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-slate-700">{name}</span>
                    <span className="text-xs font-black text-slate-400">{count} sold</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(count / stats.topItems[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {stats.topItems.length === 0 && (
              <p className="text-center text-slate-400 text-sm font-medium py-4">No sales data available yet.</p>
            )}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 text-lg mb-6">Orders by Source</h3>
          <div className="space-y-3">
            {stats.sources.map(([source, count]) => (
              <div key={source} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    source === 'Instagram' ? 'bg-purple-500' :
                    source === 'Marketplace' ? 'bg-blue-500' :
                    source === 'FB Page' ? 'bg-indigo-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-sm font-bold text-slate-600">{source}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{count} orders</span>
              </div>
            ))}
            {stats.sources.length === 0 && (
              <p className="text-center text-slate-400 text-sm font-medium py-4">No source data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;