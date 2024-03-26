import { Avatar, Box, Button } from "@chakra-ui/react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Header() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isGettingUser, setGettingUser] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user); setGettingUser(false)


            } else {
                setCurrentUser(null); setGettingUser(false)

            }
        })

        return () => updateUser();
    }, [])
    return (
        <>
            <nav className="w-full h-[10vh] bg-transparent absolute z-50 top-0 left-0">
                <header className="max-w-[1440px] py-3 px-5 flex justify-between items-center">
                    <div>
                        <Link to={"/"} className="no-underline font-diarySignature text-4xl max-sm:text-3xl font-bold text-transparent bg-gradient-to-r from-diarySecondaryText to-diaryAccentText  bg-clip-text" >
                            Diary Trail
                        </Link>
                    </div>
                    <div>
                        {currentUser ?
                            <Box onClick={() => navigate("/dashboard")} cursor={"pointer"} _hover={{ filter: "brightness(0.8)" }} className="transition-all">
                                <Avatar name={currentUser.displayName || undefined} size={"md"} src={currentUser.photoURL || undefined} />
                            </Box>
                            : <Button size={"lg"} isLoading={isGettingUser} colorScheme="" className="bg-diaryAccent text-diaryPrimaryText hover:brightness-110 active:brightness-90" onClick={() => navigate('/login')} variant={"solid"}>
                                Login
                            </Button>}
                    </div>
                </header>
            </nav>
        </>)
}

export default Header