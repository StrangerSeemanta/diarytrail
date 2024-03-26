import { Fragment } from "react/jsx-runtime"
import NoteBook from "./../assets/favicon.png"
import { Button } from "@chakra-ui/react"
import WritingAnime from "./../assets/writingAnime.json"
import ShareAnime from "./../assets/shareAnime.json"
import CPANIME from "./../assets/cpaAnime.json"
import SecurityAnime from "./../assets/securutyAnime.json"
import CustomizeAnime from "./../assets/custimizeAnime.json"
import ToDoListAnime from "./../assets/todoListAnime.json"
import ConnectionAnime from "./../assets/ConnectionAnime.json"

import Lottie from "lottie-react"
import FeatureCard from "../Components/FeatureCard"
import { BiCopyright } from "react-icons/bi"
import { useEffect, useRef, useState } from "react"
import { FaArrowUp } from "react-icons/fa"
import Header from "../Components/Header"
function Homepage() {
    const secondSection = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (secondSection) {
            const handleScroll = () => {
                if (secondSection && secondSection.current) {
                    if (window.scrollY > secondSection.current.offsetHeight * 0.5) {
                        setIsVisible(true);

                    } else {
                        setIsVisible(false);
                    }
                }
            };

            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [secondSection]);
    return (
        <Fragment>
            <Header />
            <section id="_hero_section" className="min-h-screen bg-diaryPrimary dark:bg-diaryHiddenText pt-6 ">
                <div className="flex w-full min-h-screen " >
                    <div className="min-h-screen w-2/3 lg:w-1/2 2xl:w-full pl-8 pt-14 flex flex-col justify-center lg:items-center items-start">
                        <h1 className="text-3xl sm:text-6xl md:text-7xl 2xl:text-9xl font-bold  bg-gradient-to-r from-diarySecondaryText  to-[#99ffeb] to-60% bg-clip-text text-transparent">
                            <span className="text-diaryPrimaryText">Write</span> Your Thoughts, <span className="text-diaryPrimaryText">Share</span> Your Stories & <span className="text-diaryPrimaryText">Trail</span> The Diaries with DiaryTrail
                        </h1>
                        <div className="w-full mt-3 flex gap-2" >
                            <Button variant="solid" colorScheme="#FF6F61" className="bg-diaryAccent text-diaryPrimaryText font-semibold text-lg" size="lg">Start Trailing Now !</Button>

                        </div>
                    </div>
                    <div className="h-fit w-1/3 lg:w-1/2 2xl:hidden bg-transparent flex justify-end lg:items-center items-start pt-14">
                        <img data-aos="slide-left" src={NoteBook} alt="" />
                    </div>
                </div>
            </section>
            <section ref={secondSection} className="min-h-screen relative bg-diaryPrimary dark:bg-diaryHiddenText w-full overflow-hidden" >
                <div className="min-h-[70vh] absolute -bottom-0 left-0 w-full bg-diarySecondary dark:bg-diaryPrimary/80 rounded-t-full">
                    <FeatureCard
                        data-aos="zoom-in"

                        featureIcon={<Lottie animationData={WritingAnime} className="ml-2 w-32 h-32 p-0 flex justify-center items-center" />

                        }
                        featureTitle={"Write Down Your Thoughts"}
                        featureDescription={<>Capture your thoughts, emotions, and experiences in your own private space, allowing you to express yourself freely and authentically. Whether you're documenting daily adventures, processing emotions, or setting goals, DiaryTrail provides the perfect platform to chronicle your life's journey.</>}
                        classNames={{
                            base: "absolute  p-1 pb-5 px-3 max-w-lg w-[250px] min-h-[50vh] md:w-[500px] -top-28 md:-top-32 left-[50%] -ml-[125px] md:-ml-[250px]"
                        }}
                    />

                </div>
            </section>
            <section className="min-h-screen relative bg-diaryAccent dark:bg-diaryDarkPrimary w-full overflow-hidden" >
                <div className="min-h-[70vh] absolute -top-0 left-0 w-full bg-diarySecondary/80 dark:bg-diaryPrimary/60 rounded-b-full">
                    <div className="absolute bg-transparent -top-0 left-[50%] w-fit -translate-x-[50%]">
                        <h1 className="w-full text-center text-4xl lg:text-6xl font-bold text-diaryAccentText font-diaryTitleAlt">Two In One</h1>
                    </div>
                    <FeatureCard
                        data-aos="zoom-in"
                        featureIcon={<Lottie animationData={ToDoListAnime} className=" w-44 h-44 p-1 flex justify-center items-center" />
                        }
                        featureTitle={"Effortless Task Management"}
                        featureDescription={<h3>{"Streamline your productivity with integrated to-do lists. Seamlessly manage your tasks alongside your diary entries, prioritize your goals, and stay on top of your commitments with ease."
                        }</h3>}
                        classNames={{
                            base: "absolute  p-1 pb-5 px-3 max-w-lg w-[250px] min-h-[50vh] md:w-[500px] -bottom-28 md:-bottom-32 left-[50%] -ml-[125px] md:-ml-[250px]"
                        }}
                    />

                </div>
            </section>
            <section className="min-h-screen p-4 pt-16 relative bg-diaryAccent dark:bg-diaryDarkPrimary w-full overflow-hidden" >
                <h1 className="text-6xl w-full text-center mb-3 font-semibold font-diaryTitleAlt text-diaryPrimaryText">The Features You Will Love </h1>
                <div className="w-full py-6 h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-10 "><FeatureCard

                    featureIcon={
                        <Lottie animationData={ConnectionAnime} className=" w-44 h-44 p-0 flex justify-center items-start" />
                    }
                    featureTitle="Inspiration and Connection"
                    featureDescription={<h3>{"Connect with like-minded individuals and find inspiration in shared experiences. Explore a treasure trove of diaries published by our community members, and discover the power of storytelling to unite and uplift."
                    }</h3>}
                    classNames={{
                        title: "md:text-2xl",
                    }}
                />
                    <FeatureCard

                        featureIcon={
                            <Lottie animationData={ShareAnime} className=" w-44 h-44 p-0 flex justify-center items-start" />
                        }
                        featureTitle={"Share Your Favorite Diary"}
                        featureDescription={<h3>Share your personal journey with friends, family, or the world with DiaryTrail's <strong>easy-to-use</strong> sharing feature. Whether you want to inspire others with your experiences, seek advice, or simply connect with like-minded individuals, sharing your diary entries has never been simpler. With just a few clicks, you can open up your world and invite others to be a part of your story.</h3>}
                        classNames={{
                            title: "md:text-2xl",
                        }}
                    />
                    <FeatureCard

                        featureIcon={
                            <Lottie animationData={CPANIME} className=" w-44 h-44 p-1 flex justify-center items-center" />
                        }
                        featureTitle="Stay Organized Anywhere, Anytime"
                        featureDescription={<h3>Keep your life organized effortlessly, whether you're at home, work, or on the go. Our cross-platform accessibility ensures that your diaries are always at your fingertips, no matter where life takes you.</h3>}
                        classNames={{
                            title: "md:text-2xl",
                        }}
                    />

                    <FeatureCard

                        featureIcon={
                            <Lottie animationData={SecurityAnime} className=" w-44 h-44 p-0 flex justify-center items-start" />
                        }
                        featureTitle="Privacy and Security You Can Trust"
                        featureDescription={<h3>{"Rest easy knowing that your personal thoughts and memories are safe and secure with us. Our robust privacy and security measures ensure that your diaries, sensitive informations, uploaded files, conversations remain private and confidential, accessible only to you until you publish it."
                        }</h3>}
                        classNames={{
                            title: "md:text-2xl",
                        }}
                    />

                    <FeatureCard

                        featureIcon={
                            <Lottie animationData={CustomizeAnime} className=" w-44 h-44 p-1 flex justify-center items-start" />
                        }
                        featureTitle="Fully Customizable"
                        featureDescription={<h3>{"Express yourself freely with our customizable diary features. From personalized themes and layouts to creative formatting options, unleash your creativity and make each diary entry uniquely yours."
                        }</h3>}
                        classNames={{
                            title: "md:text-2xl",
                        }}
                    />
                </div>

            </section>
            <footer className="bg-diaryAccent  dark:bg-diaryDarkPrimary w-full h-[40vh] flex justify-center items-center">
                <div className="p-5 scale-80 sm:scale-100 bg-gradient-to-t dark:bg-gradient-to-b from-white to-pink-200 dark:from-violet-950 dark:to-purple-900 rounded-full shadow-2xl shadow-black/30 flex flex-col max-w-lg justify-center items-center">
                    <span className="text-sm flex gap-1 justify-center items-center"><BiCopyright /> 2024 <strong className="text-diaryAccentText"> DiaryTrail</strong>. All rights reserved.</span>
                    <span className="text-tiny text-center">Unauthorized use or duplication of this material without express and written permission from DiaryTrail is strictly prohibited.</span>
                </div>
            </footer>
            {isVisible &&
                <div onClick={() => window.scrollTo(0, 0)} className="flex rounded-full justify-center items-center fixed scale-75 lg:scale-100 w-14 h-14 bg-white bottom-5 right-5 lg:bottom-10 lg:right-10 shadow-xl shadow-black/30">
                    <FaArrowUp size={30} className="text-diaryAccentText dark:text-diaryBlueText" />
                </div>}
        </Fragment>
    )
}

export default Homepage