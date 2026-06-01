import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FlashProps {
    success?: string;
    error?: string;
    info?: string;
}

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('navigate', (event) => {
            const flash = event.detail.page.props.flash as FlashProps | undefined;

            if (!flash) return;

            if (flash.success) {
                toast.success(flash.success);
            }
            if (flash.error) {
                toast.error(flash.error);
            }
            if (flash.info) {
                toast.info(flash.info);
            }
        });
    }, []);
}
