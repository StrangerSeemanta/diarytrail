import { FormEvent, useEffect, useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { Fragment } from "react/jsx-runtime";
import GoogleIcon from "../assets/GoogleIcon";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getUser } from "../firebase/auth";
import { FirebaseApp } from "../firebase/app_fiebase";
import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon } from "@chakra-ui/react";
import Header from "../Components/Header";
function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [isLogging, setLogging] = useState(false);
    const [isInvalidInput, setIsInvalidInput] = useState(false);

    const navigate = useNavigate()
    const handleGoogleSignIn = () => {
        const auth = getAuth()
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(() => {
                navigate("/");

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleEmailPasswordLogin = (event: FormEvent) => {
        event.preventDefault();
        setLogging(true);
        const auth = getAuth(FirebaseApp);
        signInWithEmailAndPassword(auth, emailInput, passwordInput).then(() => {
            setLogging(false);
            setIsInvalidInput(false)

            navigate('/')
        }).catch((reason) => {
            setLogging(false);
            console.error(reason);
            setIsInvalidInput(true)
        })
    }
    useEffect(() => {
        getUser().then(user => {
            if (user) {
                navigate("/")
            }
        }).catch((error) => {
            console.log(error)
        })

    }, [navigate])

    return (
        <Fragment>
            <Header />
            <section className="min-h-screen  bg-white dark:bg-diaryDarkPrimary w-full  flex justify-between items-center overflow-x-hidden">
                <div data-aos="fade-down-right" className=" w-1/2 min-h-screen flex justify-end items-center h-full bg-gradient-to-b from-diaryBlueText to-90% to-purple-900 dark:from-black dark:to-purple-950 rounded-br-full relative py-10">


                    <h1 className="hidden lg:block absolute -right-16 xl:-right-24 animate-appearance-in top-20 lg:top-[50%] lg:-translate-y-[50%] w-fit  text-6xl xl:text-8xl tracking-wide font-diaryQuickSand py-2 font-bold text-transparent bg-gradient-to-r from-diarySecondaryText  to-diaryAccentText from-30% bg-clip-text">Dairy Trail</h1>


                </div>
                <div data-aos="fade-down" className="lg:w-1/2 w-full font-diaryQuickSand absolute lg:relative flex lg:pr-10 justify-center lg:justify-end items-end lg:items-center min-h-screen " >
                    <div className="px-6 py-7 shadow-xl flex-col flex gap-3 w-full md:w-[512px] lg:w-96 mt-[10vh] h-[85vh] md:min-h-[75vh] bg-gradient-to-t from-pink-200 dark:from-diaryBlueText dark:to-black/30 md:dark:border dark:border-white/20 to-pink-50 lg:rounded-xl ">
                        <h1 className="text-3xl font-diaryQuickSand font-bold  text-diaryAccentText dark:text-diaryPrimaryText w-full text-center mb-4">Welcome Back</h1>
                        <form action="#" onSubmit={handleEmailPasswordLogin} className="flex flex-col gap-4">
                            <InputGroup>
                                <InputLeftAddon>
                                    {<MdEmail size={20} />}
                                </InputLeftAddon>
                                <Input isInvalid={isInvalidInput} autoComplete="username" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" size="md" variant="outline" aria-label="email" placeholder="Enter Your Email" />

                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon>
                                    <MdLock size={20} />
                                </InputLeftAddon>
                                <Input isInvalid={isInvalidInput} autoComplete="current-password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type={showPassword ? "text" : "password"} size="md" variant="outline" aria-label="password" placeholder="Enter Your Password" />
                                <InputRightAddon>
                                    {
                                        <div onClick={() => setShowPassword((v) => !v)} className="cursor-pointer">
                                            {showPassword ? <RxEyeOpen size={20} /> : <RxEyeClosed size={20} />}
                                        </div>
                                    }
                                </InputRightAddon>
                            </InputGroup>

                            <Button isLoading={isLogging} type="submit" colorScheme="#FF6F61" className="bg-diaryAccent text-diaryPrimaryText text-lg"> Log In</Button>
                        </form>
                        <div className="font-bold text-sm lg:text-lg mt-2">Don't Have An Account? <Link to="/signup" className="no-underline hover:underline  ml-2 text-diaryAccentText"> Sign Up Now</Link></div>
                        <div onClick={handleGoogleSignIn} className="w-full lg:w-3/4 mx-auto p-1 mt-2 lg:mt-6 hover:opacity-70 transition-all cursor-pointer active:shadow-none text-center bg-white text-diaryHiddenText shadow-lg rounded-full font-diaryQuickSand font-bold flex justify-center items-center px-3"><GoogleIcon size={35} /> Sign In With Google</div>
                    </div>
                </div>
            </section>
        </Fragment >
    )
}

export default LoginPage