import { Fragment, useEffect, useRef, useState } from "react";
import { Box, Flex, Text, Avatar, Button, Input, Spinner, IconButton, AvatarBadge, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useNavigate, useParams } from "react-router";
import { getUserData_public, UserData_public } from "../Modules/Public_UserDataDB";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Message, createRoom, deleteRoom, getMessages, listenToNewMessages, updateLastMessage, updateMessages } from "../Modules/ConversationsDB";
import { base64Encode } from "../Modules/tokenize";
import { MdDone } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

function Messenger() {
    const { msgWith } = useParams();
    const navigate = useNavigate();
    const [connectedUser, setConnectedUser] = useState<UserData_public | null>(null);
    const [messageInput, setMessageInput] = useState(""); // State to manage message input
    const [messages, setMessages] = useState<Message[]>([]); // State to manage message history
    const [newMessages, setNewMessages] = useState<Message[]>([]); // State to manage message history

    const [currentUserDetails, setCurrentUser] = useState<UserData_public | null>(null);
    const [isGettingUser, setGettingUser] = useState<boolean>(true);
    const [isSent, setSent] = useState(false);
    const chat_boxRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const auth = getAuth();
        setGettingUser(true)
        const updateUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDetails = await getUserData_public(base64Encode(user.uid));
                setCurrentUser(userDetails);
                setGettingUser(false)
            } else {
                setCurrentUser(null);
                setGettingUser(false)
            }
        })

        return () => updateUser();
    }, [])

    useEffect(() => {
        const fetchUserDataPublic = async () => {
            setSent(false);
            if (msgWith && currentUserDetails) {
                try {
                    const userData = await getUserData_public(msgWith);
                    setConnectedUser(userData);
                    const messages = await getMessages(currentUserDetails.dtid, msgWith);
                    setMessages(messages);
                    // Fetch messages for the selected conversation
                    // Example: Replace 'fetchMessagesForConversation' with your actual function

                } catch (error) {
                    console.error("can't get userdata_public: ", error)
                }
            }
        }

        fetchUserDataPublic();

    }, [msgWith, currentUserDetails])

    const sendMessage = async () => {
        if (connectedUser && currentUserDetails) {
            if (messageInput.trim() === "") return; // Don't send empty messages

            // Clear the message input after sending
            setMessages((prev) => [...prev, { text: messageInput, timestamp: new Date(), sender: currentUserDetails }])
            setMessageInput("");
            setSent(false)
            const conversationId = [currentUserDetails.dtid, connectedUser.dtid].sort().join('');

            // Send message to the connected user
            await createRoom({
                sender: currentUserDetails,
                receiver: connectedUser
            }, messageInput);
            await updateLastMessage({
                sender: currentUserDetails,
                receiver: connectedUser
            }, messageInput);

            await updateMessages(conversationId, {
                sender: currentUserDetails,
                text: messageInput,
                timestamp: new Date()
            })

            setSent(true);
            await listenToNewMessages(currentUserDetails.dtid, connectedUser.dtid, (newMessage) => {
                setNewMessages(newMessage);
                setSent(false)
            }, (err => console.error(err)));

        }
    };
    useEffect(() => {
        if (newMessages) {
            setMessages(newMessages);
        }
    }, [newMessages])
    useEffect(() => {
        // Scroll to the bottom of the chat box
        if (chat_boxRef.current) {
            chat_boxRef.current.scrollTop = chat_boxRef.current.scrollHeight;
        }
    }, [messages]);
    const handleConversationDelete = async () => {
        if (currentUserDetails && connectedUser) {
            await deleteRoom({
                sender: currentUserDetails,
                receiver: connectedUser
            })
        }

    }
    return (
        <Fragment>
            {isGettingUser ? (
                <Box className="w-full h-full flex justify-center items-center">
                    <Spinner color="coral" size={"lg"} />
                </Box>
            ) : (
                !connectedUser ? (
                    <Box className="w-full h-full flex justify-center items-center">
                        <Spinner color="coral" size={"lg"} />
                    </Box>
                ) : (
                    <Box flex="1" bg="white" p={4} w={"100%"} h={"100%"}>
                        <Flex
                            w="100%"
                            h="100%"
                            direction="column"
                            alignItems="stretch"
                            justifyContent="space-between"
                            pos={"relative"}
                        >
                            {/* Header */}
                            <Flex className="bg-transparent shadow-lg" alignItems="center" justifyContent={"space-between"} p={4}>
                                <Flex alignItems="center">
                                    <IconButton mr={4} onClick={() => navigate(-1)} isRound size={"sm"} aria-label="back-btn">
                                        <BiArrowBack size={19} />
                                    </IconButton>                                    <Avatar name={connectedUser.displayName || undefined} src={connectedUser.photoURL || undefined} size="sm" mr={2}>
                                        <AvatarBadge boxSize='1.25em' bg='green.500' />
                                    </Avatar>
                                    <Text fontWeight="bold" fontSize={"1rem"}>{connectedUser.displayName}</Text>
                                </Flex>


                                <Menu >
                                    <MenuButton as={"div"} className="cursor-pointer hover:brightness-95">
                                        <IconButton size={"sm"} isRound aria-label="dt-chat-three-dot">
                                            <BsThreeDotsVertical />
                                        </IconButton>
                                    </MenuButton>
                                    <MenuList className="">
                                        <MenuItem onClick={handleConversationDelete} >Delete Chat
                                            <AiFillDelete className="mx-3" size={19} />
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                            </Flex>

                            {/* Messages */}
                            <Box overflow={"auto"} className="cscroll" ref={chat_boxRef} h={"100%"}>
                                <Box px={4} py={2} overflowY="auto" className="cscroll">
                                    {messages.length > 0 ? messages.map((message, index) => (
                                        <Flex gap={2} alignItems={"end"} direction={"row"} key={index} justifyContent={message.sender.dtid === currentUserDetails?.dtid ? "flex-end" : "flex-start"} mb={2}>
                                            {message.sender.dtid !== currentUserDetails?.dtid && <Avatar size="sm" src={message.sender.photoURL || undefined} />}
                                            <Box className={twMerge("rounded-full text-sm ", message.sender.dtid === currentUserDetails?.dtid ? "bg-gray-200 rounded-br-none" : " bg-diaryAccent text-white")} px={3} py={2} boxShadow="md" maxW="60%">
                                                <Text>{message.text}</Text>
                                            </Box>
                                        </Flex>

                                    )) : <h1 className="h-[40vh] text-center ">Say hi to your friend 👋👋</h1>}
                                    {isSent && <Flex justifyContent={"end"} alignItems={"center"} gap={1}> <span className="text-[12px] text-black/70">sent</span>  <MdDone size={10} className="text-black/70" /> </Flex>}

                                </Box>

                                {/* Input Box */}

                            </Box>
                            <Flex bg="gray.100" p={3}>
                                <Input variant="unstyled" placeholder="Type your message..." borderRadius="full" px={3} mr={2} flex="1" value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}>
                                </Input>
                                <Button bgColor={"coral"} color={"white"} _hover={{ filter: "brightness(0.9)" }} _active={{ filter: "brightness(1.1)" }}
                                    transition={"all linear 150ms"} borderRadius="full" leftIcon={<FaPaperPlane />} onClick={sendMessage}>
                                    Send
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                )
            )}
        </Fragment>
    )
}

export default Messenger;
