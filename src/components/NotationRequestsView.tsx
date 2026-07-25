import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const NotationRequestsView = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'songRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Requested Song Notations</h2>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <p className="font-bold">{req.songName}</p>
            <p className="text-gray-600">Singer: {req.singerName} | Movie: {req.movieName || 'N/A'}</p>
            <p className={`text-sm ${req.status === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>Status: {req.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
