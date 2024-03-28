import { Avatar, Box, Button, CircularProgress, CircularProgressLabel, Flex, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { User, getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { Fragment, useEffect, useRef, useState } from "react";
import { BiCamera, BiEdit } from "react-icons/bi";
import { UserData, getUserDetails, updateUserDetailsField } from "../Modules/UserDetailsDB";
import { CgAdd } from "react-icons/cg";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FirebaseApp } from "../firebase/app_fiebase";
import formatBytes from "../Modules/FomartBytes";
import PhotoViewer from "../Components/PhotoViewer";

const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<UserData | null>(null)
    const [isGettingUser, setGettingUser] = useState<boolean>(true);
    const fileInput = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingValue, setUploadingValue] = useState(0);
    const [uploadingDetails, setUploadingDetails] = useState<string>("0");
    const coverfileInput = useRef<HTMLInputElement>(null);
    const [isFinishing, setIsFinishing] = useState(false);
    const [selectedCoverFileName, setSelectedCoverFileName] = useState<string>("");
    const [isCoverUploading, setIsCoverUploading] = useState(false);
    const [CoverUploadingValue, setCoverUploadingValue] = useState(0);
    const [CoverUploadingDetails, setCoverUploadingDetails] = useState<string>("0");
    const toast = useToast({ position: "bottom-right", isClosable: false })
    const { isOpen: isOpenProfileModal, onOpen: onOpenProfileModal, onClose: onCloseProfileModal } = useDisclosure()
    const { isOpen: isOpenCoverModal, onOpen: onOpenCoverModal, onClose: onCloseCoverModal } = useDisclosure()

    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const details = await getUserDetails(user);
                setUserDetails(details);
                console.log(details);

                setGettingUser(false)

            } else {
                setCurrentUser(null); setGettingUser(false)

            }
        })

        return () => updateUser();
    }, []);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFileName(event.target.files[0].name);
        } else {
            setSelectedFileName("");
        }
    };
    const handleCoverPhotoUpload = async () => {
        if (currentUser && coverfileInput.current?.files && coverfileInput.current.files.length > 0 && selectedCoverFileName.length > 0) {
            setIsCoverUploading(true);
            const storage = getStorage(FirebaseApp);
            const file = coverfileInput.current.files[0];
            const url = `storage/${currentUser.uid}/coverPic/${file.name}`;
            const storeRef = ref(storage, url);

            // Upload the file
            const uploadTask = uploadBytesResumable(storeRef, file);

            // Listen for state changes and progress
            uploadTask.on("state_changed",
                (snapshot) => {
                    // Get upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setCoverUploadingValue(progress);
                    setCoverUploadingDetails(`Uploaded ${formatBytes(snapshot.bytesTransferred)} of ${formatBytes(snapshot.totalBytes)} `)
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error("Error uploading file: ", error);
                    setIsCoverUploading(false);

                    toast({
                        status: "error",
                        title: "Upload Failed, Try Again"
                    })
                },
                async () => {
                    // Handle successful uploads
                    const downloadUrl = await getDownloadURL(storeRef);
                    await updateUserDetailsField(currentUser, {
                        fieldName: "coverPhotoURL",
                        newValue: downloadUrl
                    })
                    setIsCoverUploading(false);
                    toast({
                        status: "success",
                        title: "Really Nice! ", description: "Your New Cover Photo Updated"
                    })
                    setSelectedCoverFileName("");
                    onCloseCoverModal()
                    // await fetchPhotos();
                }
            );
        } else {
            toast({
                status: "error",
                title: "No File Selected", description: "Select An Image File "
            })
        }
    };
    const handleUploadFile = async () => {
        if (currentUser && fileInput.current?.files && fileInput.current.files.length > 0 && selectedFileName.length > 0) {
            setIsUploading(true);
            setIsFinishing(false)
            const storage = getStorage(FirebaseApp);
            const file = fileInput.current.files[0];
            const url = `storage/${currentUser.uid}/profilePic/${file.name}`;
            const storeRef = ref(storage, url);

            // Upload the file
            const uploadTask = uploadBytesResumable(storeRef, file);

            // Listen for state changes and progress
            uploadTask.on("state_changed",
                (snapshot) => {
                    // Get upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadingValue(progress);
                    setUploadingDetails(`Uploaded ${formatBytes(snapshot.bytesTransferred)} of ${formatBytes(snapshot.totalBytes)} `)
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error("Error uploading file: ", error);
                    setIsUploading(false);

                    toast({
                        status: "error",
                        title: "Upload Failed, Try Again"
                    })
                },
                async () => {
                    // Handle successful uploads
                    setIsFinishing(true)

                    const downloadUrl = await getDownloadURL(storeRef);
                    await updateProfile(currentUser, {
                        photoURL: downloadUrl
                    })
                    await updateUserDetailsField(currentUser, {
                        fieldName: "photoURL",
                        newValue: downloadUrl
                    })
                    setIsUploading(false);
                    toast({
                        status: "success",
                        title: "Looking Great! ", description: "Your New Profile Photo Updated"
                    })
                    setSelectedFileName("");
                    onCloseProfileModal()
                    // await fetchPhotos();
                }
            );
        } else {
            toast({
                status: "error",
                title: "No File Selected", description: "Select An Image File "
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
                                <Flex direction="column" align="center" justify="start" h="100vh" p={3}>
                                    <div className="relative w-full h-fit ">
                                        <PhotoViewer src={userDetails.coverPhotoURL || "https://via.placeholder.com/1500x500"}>
                                            <Image
                                                src={userDetails.coverPhotoURL || "https://via.placeholder.com/1500x500"}
                                                alt="Cover Image"
                                                w="100%"
                                                h="200px"
                                                objectFit="cover"
                                            />
                                        </PhotoViewer>
                                        <div onClick={onOpenCoverModal} className="absolute bottom-3 right-2">
                                            <div className=" rounded-full group transition-all flex gap-2 items-center justify-between text-diaryPrimaryText font-bold bg-diaryBlueText cursor-pointer hover:opacity-80 w-fit p-2">
                                                <span> <BiEdit size={18} /></span>
                                            </div>
                                        </div>
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
                                        <div onClick={onOpenProfileModal} className="absolute -bottom-1 right-0">
                                            <div className="rounded-full  flex gap-2 items-center p-1 text-diaryPrimaryText font-bold bg-diaryBlueText cursor-pointer hover:opacity-80 w-fit">
                                                <BiCamera size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <Box mt="4">
                                        <Heading as="h1" size="lg">
                                            {userDetails.displayName}
                                        </Heading>
                                        <Text mt="2" color="gray.600">
                                            {userDetails.email}
                                        </Text>
                                        <Text mt="4" fontSize="md">
                                            Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                            gravida nisi ut magna vestibulum, nec varius lectus ullamcorper.
                                            Donec elementum justo et magna euismod, in commodo elit maximus.
                                        </Text>
                                        <Text mt="2" fontSize="md">
                                            Location: New York City, USA
                                        </Text>
                                        <Text mt="2" fontSize="md">
                                            Interests: Traveling, Photography, Coding
                                        </Text>
                                    </Box>
                                </Flex>

                                <Modal isCentered isOpen={isOpenProfileModal} onClose={onCloseProfileModal}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Upload Profile Picture</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <div className="w-full h-[20vh] flex flex-col gap-3 justify-center items-center">
                                                {isUploading ?
                                                    <>
                                                        <CircularProgress isIndeterminate={isFinishing} value={uploadingValue} color='green.400'>
                                                            <CircularProgressLabel>{`${Math.floor(Math.round(uploadingValue))}%`}</CircularProgressLabel>
                                                        </CircularProgress>
                                                        <Text>{isFinishing ? "Finishing Touches" : uploadingDetails}</Text>
                                                    </> :
                                                    <>
                                                        <label htmlFor="profile-photo" className="rounded-full  flex gap-2 items-center p-3 text-diaryAccentText font-bold bg-transparent cursor-pointer hover:opacity-80 w-fit">
                                                            {selectedFileName ?
                                                                <Text>{selectedFileName}</Text>
                                                                : <CgAdd size={40} />}
                                                        </label>
                                                        <input ref={fileInput} onChange={handleFileInputChange} type="file" className="hidden" id="profile-photo" name="profile-photo" aria-label="profile-photo" />
                                                        <Button onClick={handleUploadFile} colorScheme="facebook">
                                                            Upload
                                                        </Button>
                                                    </>
                                                }
                                            </div>
                                        </ModalBody>
                                    </ModalContent></Modal>

                                <Modal isCentered isOpen={isOpenCoverModal} onClose={onCloseCoverModal}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Upload Cover Picture</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <div className="w-full h-[20vh] flex flex-col gap-3 justify-center items-center">
                                                {isCoverUploading ?
                                                    <>
                                                        <CircularProgress value={CoverUploadingValue} color='green.400'>
                                                            <CircularProgressLabel>{`${Math.floor(Math.round(CoverUploadingValue))}%`}</CircularProgressLabel>
                                                        </CircularProgress>
                                                        <Text>{CoverUploadingDetails}</Text>
                                                    </> :
                                                    <>
                                                        <label htmlFor="cover-photo" className="rounded-full  flex gap-2 items-center p-3 text-diaryAccentText font-bold bg-transparent cursor-pointer hover:opacity-80 w-fit">
                                                            {selectedCoverFileName ?
                                                                <Text>{selectedCoverFileName}</Text>
                                                                : <CgAdd size={40} />}
                                                        </label>
                                                        <input ref={coverfileInput} onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setSelectedCoverFileName(e.target.files[0].name) } }} type="file" className="hidden" id="cover-photo" name="cover-photo" aria-label="cover-photo" />
                                                        <Button onClick={handleCoverPhotoUpload} colorScheme="facebook">
                                                            Upload
                                                        </Button>
                                                    </>
                                                }
                                            </div>
                                        </ModalBody>
                                    </ModalContent></Modal>
                            </Fragment>
                        )
            }
        </Fragment>
    );
};

export default ProfilePage;
