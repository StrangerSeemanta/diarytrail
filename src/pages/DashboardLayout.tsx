import { Outlet } from "react-router"
import Sidebar from "../Components/Sidebar"
import { User } from "firebase/auth"

interface DashboardLayoutProps {
    userDetails: User;
}
function DashboardLayout({ userDetails }: DashboardLayoutProps) {
    return (
        <>
            <Sidebar currentUser={userDetails}>
                <div className="bg-red h-fit w-full p-3">
                    <Outlet />
                </div>
            </Sidebar>
        </>
    )
}

export default DashboardLayout