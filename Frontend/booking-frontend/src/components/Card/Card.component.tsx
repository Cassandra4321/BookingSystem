import { AppButton } from '../Button/Button.component'
import './Card.component.css'

interface AppCardProps {
	title?: string
	description?: string
	time?: string
	bookings?: string
	onClick?: () => void
	buttonText?: string
	buttonDisabled?: boolean
	buttonVariant?: 'default' | 'cancel'
}

export function AppCard({
	title,
	description,
	time,
	bookings,
	onClick,
	buttonText,
	buttonDisabled = false,
	buttonVariant = 'default',
}: AppCardProps) {
	return (
		<div className="card h-100 custom-width">
			<div className="card-body">
				<h5 className="card-title">{title}</h5>
				<p className="card-description">{description}</p>
				<p className="card-description">Tid {time}</p>

				{bookings && (
					<p className="card-description">
						Bokade platser: {bookings}
					</p>
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
	)
}
