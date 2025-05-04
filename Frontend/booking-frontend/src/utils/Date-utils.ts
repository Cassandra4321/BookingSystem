export function FormatDate(start?: string | Date, end?: string | Date): string {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    return `${startDate.toLocaleDateString('sv-SE', dateOptions)}, kl. ${startDate.toLocaleTimeString('sv-SE', timeOptions)} - ${endDate.toLocaleTimeString('sv-SE', timeOptions)}`;
}