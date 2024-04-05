import { Avatar, Box, Flex, Heading, IconButton, Spinner, Text, useToast } from "@chakra-ui/react";
import { User, getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { Fragment, useEffect, useState } from "react";
import { BiCamera, BiEdit } from "react-icons/bi";
import { UserData, getUserDetails, updateUserDetailsField } from "../Modules/UserDetailsDB";

import PhotoViewer from "../Components/PhotoViewer";
import { CiEdit } from "react-icons/ci";
import BioForm from "../Components/BioForm";
import FileUpload from "../Components/FileUpload";

const ProfilePage = () => {
    const [isEditBio, setEditBio] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<UserData | null>(null)
    const [isGettingUser, setGettingUser] = useState<boolean>(true);


    const toast = useToast({ position: "bottom-right", isClosable: false })

    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const details = await getUserDetails(user);
                setUserDetails(details);

                setGettingUser(false)

            } else {
                setCurrentUser(null); setGettingUser(false)

            }
        })

        return () => updateUser();
    }, []);


    const handleProfilePicUploadComplete = async (downloadUrl: string) => {
        if (currentUser) {
            await updateProfile(currentUser, {
                photoURL: downloadUrl
            });
            await updateUserDetailsField(currentUser, {
                fieldName: "photoURL",
                newValue: downloadUrl
            });
            const newDetails = await getUserDetails(currentUser)
            setUserDetails(newDetails)
        }
        else {
            toast({
                status: "error",
                title: "Something Error Happened"
            })
        }
    };

    const handleCoverPhotoUploadComplete = async (downloadUrl: string) => {

        if (currentUser) {
            await updateUserDetailsField(currentUser, {
                fieldName: "coverPhotoURL",
                newValue: downloadUrl
            });
            const newDetails = await getUserDetails(currentUser)
            setUserDetails(newDetails)
        } else {
            toast({
                status: "error",
                title: "Something Error Happened"
            })
        }
    };


    return (
        <Fragment>
            {isGettingUser ?
                <>
                    <Box className="h-screen w-full flex justify-center items-center">
                        <Spinner size={"xl"} color="orange.500" label="Page Loading..." />
                    </Box>
                </>
                : !currentUser ?
                    <Flex direction={"column"} width={"100%"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
                        <Heading>
                            No Authorized User Found
                        </Heading>
                        <Text>Sign In Again</Text>
                    </Flex>
                    : !userDetails ?
                        <Flex direction={"column"} width={"100%"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
                            <Heading>
                                You Have No Data To Show
                            </Heading>
                            <Text>We recommend you to logout and login Again</Text>
                        </Flex> : (
                            <Fragment>
                                <Flex bgColor={"white"} my={2} direction="column" align="center" justify="start" minH="100vh" w={"95%"} mx={"auto"} className="rounded-2xl overflow-x-hidden shadow-customized">
                                    <div className="relative w-full h-fit ">
                                        <PhotoViewer src={userDetails.coverPhotoURL || "https://via.placeholder.com/1500x500"}>
                                            <img
                                                src={userDetails.coverPhotoURL || "https://via.placeholder.com/1500x500"}
                                                alt="Cover Image"

                                                className="object-cover w-full h-[200px]"
                                            />
                                        </PhotoViewer>

                                        <FileUpload _dbf="coverPic" onComplete={handleCoverPhotoUploadComplete} currentUser={currentUser} trigger={
                                            <div className="absolute bottom-3 right-2 rounded-full">
                                                <div className=" rounded-full group transition-all flex gap-2 items-center justify-between text-diaryPrimaryText font-bold bg-diaryBlueText cursor-pointer hover:opacity-80 w-fit p-2">
                                                    <span> <BiEdit size={18} /></span>
                                                </div>
                                            </div>
                                        } />
                                    </div>
                                    <div className="relative ">
                                        <PhotoViewer src={currentUser.photoURL || undefined}
                                        >
                                            <Avatar

                                                size="xl"
                                                name={userDetails.displayName || undefined}
                                                src={currentUser.photoURL || undefined}
                                                mt="-8"
                                                shadow="lg"
                                            />
                                        </PhotoViewer>
                                        <FileUpload _dbf="profilePic" onComplete={handleProfilePicUploadComplete} currentUser={currentUser} trigger={
                                            <div className="absolute -bottom-1 right-0">
                                                <div className="rounded-full  flex gap-2 items-center p-1 text-diaryPrimaryText font-bold bg-diaryBlueText cursor-pointer hover:opacity-80 w-fit">
                                                    <BiCamera size={18} />
                                                </div>
                                            </div>
                                        } />
                                    </div>
                                    <Box mt="4" w={"100%"} height={"100%"}>
                                        <Box bgColor={"white"} className="flex flex-col items-center justify-center gap-1 text-center rounded-2xl w-full" py={4} px={8}>
                                            <Heading as="h1" size="lg" textAlign={"center"} fontFamily={"inherit"}>
                                                {userDetails.displayName}
                                            </Heading>
                                            <Text color="gray.600">
                                                {userDetails.email}
                                            </Text>
                                            <Box fontSize="md" mt={4} p={3} display={"flex"} justifyContent={"center"} alignItems={"end"} borderStyle={"solid"} borderColor={"#1f1f1f1f"}>
                                                {userDetails.bio ? (!isEditBio &&

                                                    <Text textAlign={"center"} className="whitespace-pre-wrap">{userDetails.bio}</Text>
                                                ) : (
                                                    <Text>Update Your Bio</Text>
                                                )}


                                                {
                                                    isEditBio ?
                                                        <BioForm currentUser={currentUser} onCancel={() => setEditBio(false)} />
                                                        :
                                                        <Flex gap={2} alignItems={"center"} justifyContent={"end"}>

                                                            <IconButton
                                                                onClick={() => setEditBio(true)}
                                                                className="shadow-customized"
                                                                size={"sm"}
                                                                isRound
                                                                variant={"ghost"}
                                                                aria-label="bio-edit-btn"
                                                            >
                                                                <CiEdit size={20} />
                                                            </IconButton>
                                                        </Flex>
                                                }

                                            </Box>

                                        </Box>
                                        <div className="mx-auto mt-4 mb-5 grid max-w-[23rem] grid-cols-3 rounded-md border-2 border-gray-100  py-4 shadow-md  dark:bg-[#37404F]">
                                            <div className="flex flex-col items-center justify-center gap-1 border-r-2  px-4  sm:flex-row">
                                                <span className="font-extrabold text-foreground">
                                                    0
                                                </span>
                                                <span className="text-sm">Diaries</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1 border-r-2  px-4  sm:flex-row">
                                                <span className="font-extrabold text-foreground">
                                                    0
                                                </span>
                                                <span className="text-sm">Following</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1  px-4  sm:flex-row">
                                                <span className="font-extrabold text-foreground">
                                                    0
                                                </span>
                                                <span className="text-sm">Follower</span>
                                            </div>

                                        </div>
                                    </Box>
                                </Flex>



                            </Fragment>
                        )
            }
        </Fragment >
    );
};

export default ProfilePage;
