"use client";

import { Bell, Loader2, X, Trash2, CheckCircle, Trash } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mengambil data dari backend
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data: notifications, isLoading, mutate } = useSWR('/user/notifications', fetcher);
  
  const notifs = notifications || [];
  const unreadCount = notifs.filter((n: any) => !n.isRead).length;

  // Aksi ke Backend
  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await api.patch(`/user/notifications/${id}/read`);
      mutate();
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/user/notifications/read-all');
      mutate();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/user/notifications/${id}`);
      mutate();
    } catch (e) { console.error(e); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Yakin hapus semua notifikasi?")) return;
    try {
      await api.delete('/user/notifications/delete-all');
      mutate();
    } catch (e) { console.error(e); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 sm:px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-black">Notifikasi</h2>
                <p className="text-xs text-gray-500">Anda memiliki {unreadCount} notifikasi belum dibaca</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Tandai semua dibaca
                  </button>
                )}
                {notifs.length > 0 && (
                  <button onClick={handleDeleteAll} className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
                    <Trash className="w-3.5 h-3.5" /> Hapus Semua
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="ml-2 rounded-full p-2 hover:bg-gray-100 transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto p-3 sm:p-4 space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
              ) : notifs.length > 0 ? (
                notifs.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                    className={`group relative flex items-start justify-between rounded-xl border p-4 transition-colors cursor-pointer ${notif.isRead ? 'border-gray-100 bg-white' : 'border-emerald-100 bg-emerald-50/50'}`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                        {!notif.isRead && <span className="rounded bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-600 uppercase">Baru</span>}
                      </div>
                      <p className="text-xs text-gray-600">{notif.message}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-medium text-gray-400">
                        <span>{formatDate(notif.createdAt)}</span>
                        <span>•</span>
                        <span className={notif.isRead ? "text-gray-400" : "text-emerald-600"}>
                          {notif.isRead ? "Telah dibaca" : "Belum dibaca"}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-200 mb-3" />
                  <h3 className="text-sm font-bold text-gray-900">Belum ada notifikasi</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}