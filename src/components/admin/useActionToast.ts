'use client';

import { useTransition } from 'react';

import { dismissToast, showToast } from '@/components/sonner';

type ToastMessages = {
  loading: string;
  success: string;
  error: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return `${fallback}: ${error.message}`;
  }

  return fallback;
};

const useActionToast = () => {
  const [isPending, startTransition] = useTransition();

  const runAction = (
    action: (formData: FormData) => Promise<unknown>,
    formData: FormData,
    messages: ToastMessages,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    const loadingId = showToast({
      kind: 'loading',
      message: messages.loading,
    });

    startTransition(async () => {
      try {
        await action(formData);
        dismissToast(loadingId);
        showToast({
          kind: 'success',
          message: messages.success,
        });
        options?.onSuccess?.();
      } catch (error) {
        dismissToast(loadingId);
        showToast({
          kind: 'error',
          message: getErrorMessage(error, messages.error),
        });
        options?.onError?.();
      }
    });
  };

  return {
    isPending,
    runAction,
  };
};

export default useActionToast;
