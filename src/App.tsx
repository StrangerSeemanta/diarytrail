import { Fragment, useEffect } from "react"
import Router from "./Router.tsx"
import { useToast } from "@chakra-ui/react";
import AOS from "aos"
import "aos/dist/aos.css"
function App() {
    const toast = useToast();
    useEffect(() => {
        AOS.init();
        const toastID = "offline-toast"
        if (!window.navigator.onLine && !toast.isActive(toastID)) {
            const checkOnlinePromise = new Promise<boolean>((resolve) => {
                if (window.navigator.onLine) {
                    resolve(true)
                }
            })
            toast.promise(checkOnlinePromise, {
                success: {
                    id: toastID,
                    title: "Hoooray ! Connection Restored.",
                    position: "bottom-right",
                    isClosable: true
                },
                loading: {
                    id: toastID,
                    title: "Ahha! It seems you are currently offline!",
                    description: "Try to reconnect your internet",
                    colorScheme: "teal",
                    position: "bottom-right",
                    isClosable: false
                },
                error: {
                    id: toastID,
                    title: "Ohho ! Something Error Occured.",
                    description: "Check your internet connection or reload",
                    position: "bottom-right",
                    isClosable: false
                }
            })
        }


    }, [toast])
    return (
        <Fragment>
            <Router />

        </Fragment>
    )
}

export default App