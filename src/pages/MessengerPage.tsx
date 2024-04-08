import MessagingUI from '../Components/MessaginUI'
import { Outlet } from 'react-router'

function MessengerPage() {
    return (
        <div className='messenger_page_container min-h-screen w-full flex justify-center items-center'>
            <MessagingUI >
                <Outlet />
            </MessagingUI>
        </div>
    )
}

export default MessengerPage