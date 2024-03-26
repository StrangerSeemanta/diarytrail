import { FormEvent, useState } from "react";
import { MdLockOutline, MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { Fragment } from "react/jsx-runtime";
import { BiUser } from "react-icons/bi";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseApp } from "../firebase/app_fiebase";
import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon, Select } from "@chakra-ui/react";
import Header from "../Components/Header";

function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [gender, setGender] = useState<string>('');
    const [isSiginingIn, setSigningIn] = useState(false);
    const handleSignUp = (event: FormEvent) => {
        event.preventDefault();
        const auth = getAuth(FirebaseApp);
        setSigningIn(true)
        createUserWithEmailAndPassword(auth, emailInput, passwordInput)
            .then(() => {
                setSigningIn(false)
            }).catch((e) => {
                console.log(e);
                setSigningIn(false)

            })
    }
    return (
        <Fragment>
            <Header />
            <section className="min-h-screen relative  bg-diaryNeutral dark:bg-diaryDarkPrimary  w-full  flex justify-between items-center overflow-x-hidden">
                <div data-aos="fade-down-right" className=" w-1/2 top-0 left-0 h-screen flex justify-end items-center bg-gradient-to-b from-diaryBlueText to-90% to-purple-900 dark:from-black dark:to-purple-950 rounded-br-full absolute py-10">
                </div>
                <div className="w-full min-h-[90vh] mt-[10vh] bg-transparent z-10 pt-4 lg:py-8">

                    <div data-aos="fade-down" className=" w-full min-h-[80vh] flex flex-col gap-5 px-8 py-9 md:max-w-lg mx-auto shadow-large bg-gradient-to-t from-pink-200 to-diaryPrimaryText dark:from-diaryBlueText dark:to-black/30 md:dark:border dark:border-white/20 ">
                        <h1 className="text-3xl font-diaryQuickSand font-bold text-diaryAccentText dark:text-diaryPrimaryText">Create New Account </h1>
                        <form onSubmit={handleSignUp} autoComplete={"off"} className="flex h-fit flex-col gap-3 w-full">

                            <InputGroup>
                                <InputLeftAddon>
                                    {<BiUser size={20} />}
                                </InputLeftAddon>
                                <Input autoComplete="name" name="name" isRequired value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" variant="outline" size="md" aria-label="name" placeholder="Enter Your Full Name" />

                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon>
                                    {<MdOutlineMailOutline size={20} />}
                                </InputLeftAddon>
                                <Input autoComplete="username" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" size="md" variant="outline" aria-label="email" placeholder="Enter Your Email" />

                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon>
                                    {<MdOutlinePhone size={20} />}                                </InputLeftAddon>
                                <Input autoComplete="phone" name="phone" isRequired value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} type="tel" variant="outline" size="md" color="default" aria-label="phone-number" placeholder="Enter Your Phone Number" />

                            </InputGroup>
                            <InputGroup>
                                <InputLeftAddon>
                                    <MdLockOutline size={20} />
                                </InputLeftAddon>
                                <Input autoComplete="current-password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type={showPassword ? "text" : "password"} size="md" variant="outline" aria-label="password" placeholder="Enter Your Password" />
                                <InputRightAddon>
                                    {
                                        <div onClick={() => setShowPassword((v) => !v)} className="cursor-pointer">
                                            {showPassword ? <RxEyeOpen size={20} /> : <RxEyeClosed size={20} />}
                                        </div>
                                    }
                                </InputRightAddon>
                            </InputGroup>
                            <Select value={gender} placeholder="Select Your Gender" onChange={(e) => setGender(e.target.value)} name="gender" isRequired variant="outline" size="md" aria-label="gender">
                                {
                                    ["male", "female", "others"].map((value) => (
                                        <option key={value} value={value}>{value.toUpperCase()}</option>
                                    ))}
                            </Select>
                            <h5 className="text-[10px] flex flex-col gap-2">
                                <span>
                                    People who use our service may have uploaded your contact information to Diary Trail. Learn more.
                                </span>
                                <span>
                                    By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
                                </span>
                            </h5>
                            <Button type="submit" isLoading={isSiginingIn} variant="solid" colorScheme="" className="bg-diaryAccent text-diaryPrimaryText" >Sign Up</Button>
                        </form>
                    </div>
                </div>
            </section>
        </Fragment >
    )
}

export default SignupPage;