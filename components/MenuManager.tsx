
import React, { useState, useEffect } from 'react';

interface CakeItem {
  id: string;
  name: string;
  basePrice: number;
}

interface MenuManagerProps {
  menu: CakeItem[];
  onAdd: (item: CakeItem) => void;
  onRemove: (id: string) => void;
  onUpdate?: (item: CakeItem) => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({ menu, onAdd, onRemove, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CakeItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Handle local state for the edit modal
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    if (editingItem) {
      setEditName(editingItem.name);
      setEditPrice(editingItem.basePrice.toString());
    }
  }, [editingItem]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    onAdd({
      id: `cake-${Date.now()}`,
      name: newName,
      basePrice: parseFloat(newPrice)
    });

    setNewName('');
    setNewPrice('');
    setIsAdding(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editName || !editPrice) return;

    if (onUpdate) {
      onUpdate({
        ...editingItem,
        name: editName,
        basePrice: parseFloat(editPrice)
      });
    }
    setEditingItem(null);
  };

  const handleDuplicateItem = (item: CakeItem) => {
    onAdd({
      ...item,
      id: `temp-${Date.now()}` // Temporary ID, backend generates real one
    });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onRemove(itemToDelete);
      setItemToDelete(null);
    }
  };

  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";
  const fieldClasses = "w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-indigo-300 transition-all placeholder:text-slate-300";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Cake Menu</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage items and pricing</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isAdding ? 'bg-rose-50 text-rose-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:scale-105'
            }`}
        >
          {isAdding ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <label className={labelClasses}>Item Name</label>
              <input
                autoFocus
                type="text"
                placeholder="Chocolate Cake"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={fieldClasses}
              />
            </div>
            <div className="relative flex-1">
              <label className={labelClasses}>Price</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="45.00"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className={fieldClasses}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
            Add to Menu
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((cake) => (
          <div key={cake.id} className="bg-white p-6 rounded-[2rem] border border-slate-100/50 shadow-sm shadow-indigo-100/20 hover:shadow-md transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900 leading-tight text-lg">{cake.name}</h3>
              <div className="flex gap-1 -mt-1 -mr-1">
                <button
                  onClick={() => handleDuplicateItem(cake)}
                  className="p-1.5 text-slate-300 hover:text-indigo-600 transition-all"
                  title="Duplicate"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
                <button
                  onClick={() => setEditingItem(cake)}
                  className="p-1.5 text-slate-300 hover:text-indigo-600 transition-all"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button
                  onClick={() => setItemToDelete(cake.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-50 w-full mb-6"></div>

            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-indigo-600 tracking-tight">${cake.basePrice.toFixed(2)}</span>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Base Price</span>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal for Deleting Item */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setItemToDelete(null)} />
          <div className="relative w-full max-w-xs bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="font-black text-slate-900 text-lg">Delete Item?</h3>
            <p className="text-slate-400 text-xs font-bold mt-1">This will remove it from your menu.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
          <form
            onSubmit={handleUpdate}
            className="relative w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Menu Item</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Update price or name</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Item Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Base Price</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
