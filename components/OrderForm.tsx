
import React, { useState, useEffect } from 'react';

interface CakeItem {
  id: string;
  name: string;
  basePrice: number;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  menu: CakeItem[];
  initialData?: any;
}

const SOURCES = ['Instagram', 'Marketplace', 'FB Page', 'Paula'];

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSubmit, menu, initialData }) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedCakeId, setSelectedCakeId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('Marketplace');
  const [total, setTotal] = useState(0);

  const isCustom = selectedCakeId === 'custom';
  const currentCake = menu.find(c => c.id === selectedCakeId);
  
  // Fix timezone issue: calculate minDate using local time, not UTC
  const now = new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName || '');
      const match = menu.find(m => m.name === initialData.itemName);
      if (match) {
        setSelectedCakeId(match.id);
      } else {
        setSelectedCakeId('custom');
        setCustomName(initialData.itemName);
        setCustomPrice((initialData.total / initialData.quantity).toString());
      }
      setPickupDate(initialData.pickupDate);
      setPickupTime(initialData.pickupTime);
      setQuantity(initialData.quantity);
      setNotes(initialData.notes);
      // Directly use the source from data, default to Marketplace if missing
      setSource(initialData.source || 'Marketplace');
    } else {
      // Reset for new order
      setCustomerName('');
      setSelectedCakeId(''); // Default to empty for "Select Item" placeholder
      
      setPickupDate(''); // Start blank
      setPickupTime(''); // Start blank

      setCustomName('');
      setCustomPrice('');
      setNotes('');
      setSource('Marketplace');
      setQuantity(1);
    }
  }, [isOpen, initialData, menu]);

  useEffect(() => {
    let unitPrice = 0;
    if (isCustom) {
      unitPrice = parseFloat(customPrice) || 0;
    } else if (currentCake) {
      unitPrice = currentCake.basePrice;
    }
    setTotal(unitPrice * quantity);
  }, [selectedCakeId, customPrice, quantity, currentCake]);

  // Validation Logic
  const isFormValid = 
    customerName.trim() !== '' && 
    selectedCakeId !== '' && 
    pickupDate !== '' && 
    pickupTime !== '' &&
    (!isCustom || (customName.trim() !== '' && customPrice.trim() !== ''));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    if (!source) {
      alert("Please select a Source");
      return;
    }
    const itemName = isCustom ? customName : (currentCake?.name || '');
    const pricePerUnit = isCustom ? (parseFloat(customPrice) || 0) : (currentCake?.basePrice || 0);
    
    onSubmit({
      customerName,
      itemName,
      quantity,
      pricePerUnit,
      notes,
      source, // Stored directly as "Instagram", "Marketplace", etc.
      pickupDate,
      pickupTime,
      total,
      timestamp: initialData ? initialData.timestamp : new Date().toISOString()
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setQuantity(Math.max(0, val));
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const labelStyle = "text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[0.1em]";
  const inputStyle = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-slate-900 font-bold text-sm";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl border border-slate-200/60 overflow-hidden transform animate-in slide-in-from-bottom-6 duration-500 ease-out flex flex-col max-h-[92vh]">
        
        <div className="px-6 pt-6 pb-3 flex justify-between items-center border-b border-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Edit Order' : 'New Order'}
            </h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-0.5">Bespoke Bakery Selection</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all active:scale-90">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-4 scrollbar-hide">
          
          <div className="space-y-1.5">
            <label className={labelStyle}>Customer Name</label>
            <input
              autoFocus
              required
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelStyle}>Select Item</label>
            <div className="relative group">
              <select
                required
                value={selectedCakeId}
                onChange={(e) => setSelectedCakeId(e.target.value)}
                className={`${inputStyle} appearance-none pr-10 ${selectedCakeId === '' ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled>Select Item</option>
                {menu.map((cake) => (
                  <option key={cake.id} value={cake.id} className="text-slate-900">{cake.name}</option>
                ))}
                <option value="custom" className="text-indigo-600 font-bold">✨ Select Item Custom</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isCustom && (
              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className={labelStyle}>Item Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Price</label>
                  <input
                    required
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelStyle}>Pickup Date</label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={inputStyle}
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelStyle}>Pickup Time</label>
                <input
                  type="time"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className={inputStyle}
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelStyle}>Quantity</label>
              <div className="flex items-center bg-slate-50 rounded-xl border-2 border-transparent focus-within:border-indigo-500 overflow-hidden">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-2.5 text-slate-400 hover:bg-slate-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"/></svg>
                </button>
                <input 
                  type="number"
                  inputMode="numeric"
                  value={quantity || ''}
                  onChange={handleQuantityChange}
                  className="flex-1 text-center font-black text-lg text-slate-900 bg-transparent outline-none w-14"
                />
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-5 py-2.5 text-slate-400 hover:bg-slate-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className={labelStyle}>Source</label>
                <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">Required</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SOURCES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`py-2 px-1 rounded-xl text-[9px] font-black uppercase tracking-tight border-2 transition-all ${source === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className={labelStyle}>Notes</label>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter italic">Optional</span>
              </div>
              <textarea
                rows={2}
                placeholder="Special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none font-medium text-sm resize-none transition-all"
              />
            </div>

            <div className="p-4 bg-slate-900 rounded-[1.5rem] flex items-center justify-between text-white shadow-xl mt-2">
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Grand Total</p>
                <p className="text-2xl font-black text-white tracking-tighter">${total.toFixed(2)}</p>
              </div>
              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/50 transition-all ${!isFormValid ? 'bg-slate-500 cursor-not-allowed opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'}`}
              >
                {initialData ? 'Update' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
