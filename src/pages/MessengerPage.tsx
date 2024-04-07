import MessagingUI from '../Components/MessaginUI'
import { Outlet } from 'react-router'

function MessengerPage() {
    return (
        <MessagingUI >
            <Outlet />
        </MessagingUI>
    )
}

export default MessengerPage