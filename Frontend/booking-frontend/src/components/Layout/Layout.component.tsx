import { Outlet } from 'react-router-dom'

export function Layout() {
	return (
		<div className="page-container">
			<div className="content">
				<Outlet />
			</div>
			<footer className="copyright">
				<p>© Copyright 2025 ZenGym</p>
			</footer>
		</div>
	)
}
