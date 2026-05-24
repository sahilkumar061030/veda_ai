'use client';

import { useEffect, useCallback } from 'react';
import { getSocket, connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUIStore } from '@/store/uiStore';

export function useSocket() {
  const { token } = useAuthStore();
  const { updateAssignmentStatus } = useAssignmentStore();
  const { setGenerationStatus } = useUIStore();

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('generation:started', (data: { assignmentId: string; message: string }) => {
      setGenerationStatus({
        assignmentId: data.assignmentId,
        status: 'started',
        progress: 10,
        message: data.message,
      });
      updateAssignmentStatus(data.assignmentId, 'processing');
    });

    socket.on('generation:progress', (data: { assignmentId: string; progress: number; message: string }) => {
      setGenerationStatus({
        assignmentId: data.assignmentId,
        status: 'progress',
        progress: data.progress,
        message: data.message,
      });
    });

    socket.on('generation:completed', (data: { assignmentId: string; paper: any }) => {
      setGenerationStatus({
        assignmentId: data.assignmentId,
        status: 'completed',
        progress: 100,
        message: 'Questions generated successfully!',
      });
      updateAssignmentStatus(data.assignmentId, 'completed', data.paper);
    });

    socket.on('generation:failed', (data: { assignmentId: string; error: string }) => {
      setGenerationStatus({
        assignmentId: data.assignmentId,
        status: 'failed',
        progress: 0,
        message: data.error,
      });
      updateAssignmentStatus(data.assignmentId, 'failed');
    });

    return () => {
      socket.off('generation:started');
      socket.off('generation:progress');
      socket.off('generation:completed');
      socket.off('generation:failed');
    };
  }, [token, updateAssignmentStatus, setGenerationStatus]);

  return getSocket();
}
