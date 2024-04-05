import { Button, CircularProgress, CircularProgressLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState, Fragment, useRef, ReactNode } from "react";
import { CgAdd } from "react-icons/cg";
import { FirebaseApp } from "../firebase/app_fiebase";
import formatBytes from "../Modules/FomartBytes";
import { User } from "firebase/auth";

interface FileUploadProps {
    currentUser: User,
    trigger: ReactNode,
    _dbf: string;
    classNames?: string;
    onComplete?: (downloadUrl: string) => void;
    onError?: (error: string) => void;
}
function FileUpload({ currentUser, _dbf, trigger, classNames, onComplete, onError }: FileUploadProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [UploadingValue, setUploadingValue] = useState(0);
    const [UploadingDetails, setUploadingDetails] = useState<string>("0");
    const toast = useToast({ position: "bottom-right", isClosable: false })
    const [isFinishing, setIsFinishing] = useState(false);

    const { isOpen: isOpenModal, onOpen, onClose: onCloseModal } = useDisclosure()

    const handleUpload = async () => {
        if (currentUser && fileInput.current?.files && fileInput.current.files.length > 0 && selectedFileName.length > 0) {
            setIsUploading(true);
            setIsFinishing(false)
            const storage = getStorage(FirebaseApp);
            const file = fileInput.current.files[0];
            const url = `storage/${currentUser.uid}/${_dbf}/${file.name}`;
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
                    // Handle unsuccessful uploads
                    console.error("Error uploading file: ", error);
                    setIsUploading(false);
                    onError && onError(`${error}`)
                    toast({
                        status: "error",
                        title: "Upload Failed, Try Again"
                    })
                },
                async () => {
                    // Handle successful uploads
                    setIsFinishing(true)

                    const downloadUrl = await getDownloadURL(storeRef);
                    onComplete && onComplete(downloadUrl)

                    setIsUploading(false);
                    toast({
                        status: "success",
                        title: "Successfully Uploaded ", description: "Your New Photo Looks Awesome"
                    })
                    setSelectedFileName("");
                    onCloseModal();
                    setIsFinishing(false)
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
            <div className={classNames ? classNames : "w-fit h-fit bg-transparent"} onClick={onOpen}>
                {trigger}
            </div>
            <Modal isCentered isOpen={isOpenModal} onClose={onCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select An Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="w-full h-[20vh] flex flex-col gap-3 justify-center items-center">
                            {isUploading ?
                                <>
                                    <CircularProgress isIndeterminate={isFinishing} value={UploadingValue} color='green.400'>
                                        <CircularProgressLabel>{`${Math.floor(Math.round(UploadingValue))}%`}</CircularProgressLabel>
                                    </CircularProgress>
                                    <Text>{isFinishing ? "Finishing Touches" : UploadingDetails}</Text>
                                </> :
                                <>
                                    <label htmlFor="upload-photo" className="rounded-full  flex gap-2 items-center p-3 text-diaryAccentText font-bold bg-transparent cursor-pointer hover:opacity-80 w-fit">
                                        {selectedFileName ?
                                            <Text>{selectedFileName}</Text>
                                            : <CgAdd size={40} />}
                                    </label>
                                    <input ref={fileInput} onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setSelectedFileName(e.target.files[0].name) } }} type="file" className="hidden" id="upload-photo" name="upload-photo" aria-label="upload-photo" />
                                    <Button onClick={handleUpload} colorScheme="facebook">
                                        Upload
                                    </Button>
                                </>
                            }
                        </div>
                    </ModalBody>
                </ModalContent></Modal>
        </Fragment >
    )
}

export default FileUpload