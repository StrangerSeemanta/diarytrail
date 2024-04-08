import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import { ReactNode, useEffect, useState } from "react"
import Nopage from "./pages/Nopage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardLayout from "./pages/DashboardLayout"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { Box, Spinner } from "@chakra-ui/react"
import ExploreDiaryPage from "./pages/ExploreDiaryPage"
import ProfilePage from "./pages/ProfilePage"
import { getUserDetails } from "./Modules/UserDetailsDB"
import MessengerPage from "./pages/MessengerPage"
import Messenger from "./Components/Messenger"
export function HeadPolish({ children, title }: { children: ReactNode, title: string }) {

    useEffect(() => {
        document.title = title
    }, [title])

    return (
        <>
            {children}
        </>
    )
}
function Router() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isGettingUser, setGettingUser] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getUserDetails(user)
                setCurrentUser(user);
                setGettingUser(false)


            } else {
                setCurrentUser(null); setGettingUser(false)

            }
        })

        return () => updateUser();
    }, [])
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" loader={Spinner} element={<Outlet />} >
                    {isGettingUser ?
                        <Route index element={
                            <HeadPolish title="Create, Share and Discover new diaries with Diary Trail">
                                <Box className="h-screen w-full flex justify-center items-center">
                                    <Spinner size={"xl"} color="orange.500" label="Page Loading..." />
                                </Box>
                            </HeadPolish>
                        } />
                        :
                        (currentUser ?
                            // Dashboard Nesting Routes
                            (<Route path="/" element={<DashboardLayout userDetails={currentUser} />} >
                                {/* Explore */}
                                <Route index element={
                                    <HeadPolish title="Discover latest diaries on Diary Trail">
                                        <ExploreDiaryPage />
                                    </HeadPolish>
                                } />

                                {/* Profile */}
                                <Route path="profile" element={
                                    <HeadPolish title="Make An Attractive Presence On Diary Trail">
                                        <ProfilePage />
                                    </HeadPolish>
                                } />

                                {/* No page for dashboard links */}

                                <Route path="/*" element={
                                    <HeadPolish title="Page Not Found - Diary Trail">
                                        <Nopage />
                                    </HeadPolish>
                                } />


                            </Route>
                            )
                            :
                            (<>

                                <Route index
                                    element={
                                        <HeadPolish title="Create, Share and Discover new diaries with Diary Trail">
                                            <Homepage></Homepage>
                                        </HeadPolish>
                                    } />
                                <Route path="home"
                                    element={
                                        <HeadPolish title="Create, Share and Discover new diaries with Diary Trail">
                                            <Homepage></Homepage>
                                        </HeadPolish>
                                    } />
                                <Route path="login"
                                    element={
                                        <HeadPolish title="One Account , That is all you need">
                                            <LoginPage />
                                        </HeadPolish>
                                    } />
                                <Route path="signup"
                                    element={
                                        <HeadPolish title="Create a new account on Diary Trail">
                                            <SignupPage />
                                        </HeadPolish>
                                    } />

                                <Route path="/*" element={
                                    <HeadPolish title="Page Not Found - Diary Trail">
                                        <Nopage />
                                    </HeadPolish>
                                } />
                            </>
                            )
                        )
                    }
                    <Route path="messages" element={<MessengerPage />}>

                        <Route path=":msgWith" element={
                            <HeadPolish title="Chat With Our Friends - Diary Trail">
                                <Messenger />
                            </HeadPolish>
                        } />
                    </Route>
                    <Route path="/*" element={
                        <Box className="h-screen w-full flex justify-center items-center">
                            <Spinner size={"xl"} color="orange.500" label="Page Loading..." />
                        </Box>} />


                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router