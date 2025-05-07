import { AppButton } from "../Button/Button.component";

interface AppCardProps {
    title?: string;
    description?: string;
    time?: string;
    bookings?: string;
    onClick?: () => void;
    buttonText?: string;
    buttonDisabled?: boolean;
    buttonVariant?: "default" | "cancel";
}

export function AppCard({
    title,
    description,
    time,
    bookings,
    onClick,
    buttonText,
    buttonDisabled = false,
    buttonVariant = "default",
}: AppCardProps) {
    return (
        <div className="card h-100 w-50">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <p><strong>Tid</strong> {time}</p>

                {bookings && (
                    <p><strong>Bokade platser:</strong> {bookings}</p>
                )}

                {buttonText && onClick && (
                    <AppButton
                        onClick={onClick}
                        disabled={buttonDisabled}
                        variant={buttonVariant}
                    >
                        {buttonText}
                    </AppButton>
                )}
            </div>
        </div>
    );
}