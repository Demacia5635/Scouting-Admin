import { NotificationInstance, NotificationPlacement } from "antd/es/notification/interface";

export type NotificationMode = 'success' | 'error' | 'info' | 'warning' | 'open';

export const sendNotification = (api: NotificationInstance, mode: NotificationMode, message: string, description: string, placement: NotificationPlacement, duration: number=5) => {
    switch (mode) {
        case 'success':
            api.success({
                message: message,
                description: description,
                placement: placement,
                duration: duration,
            });
            break;
        case 'error':
            api.error({
                message: message,
                description: description,
                placement: placement,
                duration: duration,
            });
            break;
        case 'info':
            api.info({
                message: message,
                description: description,
                placement: placement,
                duration: duration,
            });
            break;
        case 'warning':
            api.warning({
                message: message,
                description: description,
                placement: placement,
                duration: duration,
            });
            break;
        default:
            api.open({
                message: message,
                description: description,
                placement: placement,
                duration: duration,
            });
            break;
    }
}